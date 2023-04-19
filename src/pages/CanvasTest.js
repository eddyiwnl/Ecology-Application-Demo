import { Link } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import './CanvasTest.css'
import jsonData from '../model_outputs/test_output.json'
const fs = require('fs');

// const PureCanvas = React.forwardRef((props, ref) => <canvas ref={ref} />)

/* TODO
One of two functionalities: 
*/
const CanvasTest = ({projectData, setProjectData}) => {
    var testJson = require('../model_outputs/test_output.json')
    setProjectData(testJson)

    const [outputGroup, setOutputGroup] = useState("") // test output
    const [currElement, setCurrElement] = useState("") // current box id
    const [show, setShow] = useState(false) // show or no show button
    const [bboxs, setBboxs] = useState([]) // bbox_list
    const [currCtx, setCurrCtx] = useState() // current context (usually the canvasRef.current)
    const [currMajorGroup, setCurrMajorGroup] = useState("") // current selected major group
    const [numElements, setNumElements] = useState(0) // number of bounding boxes
    const [currFilepath, setCurrFilepath] = useState("")

    const [inEdit, setInEdit] = useState(false) // whether or not the user is currently editing


    const canvasRef = useRef();
    const textCanvasRef = useRef();

    var bbox_list = []

    var closeEnough = 5
    var dragTL = false;
    var dragBL = false;
    var dragTR = false;
    var dragBR = false;
    // var inEdit = false;


    // Hash table: major group -> bbox color
    /* 
    Amphipoda: Red
    Bivalvia: Yellow
    Cumacea: Dark Green
    Gastropoda: Magenta
    Insecta: Light Purple
    Ostracoda: Lime Green
    Polychaeta: Light Blue
    Other Annelida: White
    Other Crustacea: Light Red
    Other: Grey
    */
    const major_group_color = new Map();
    major_group_color.set("Amphipoda", "#E52D00")
    major_group_color.set("Bivalvia", "#E5D400")
    major_group_color.set("Cumacea", "#75A433")
    major_group_color.set("Gastropoda", "#FC30F6")
    major_group_color.set("Insecta", "#A9A0FF")
    major_group_color.set("Ostracoda", "#2DFF29")
    major_group_color.set("Polychaeta", "#2FCAF4")
    major_group_color.set("Other Annelida", "#FFFFFF")
    major_group_color.set("Other Crustacea", "#FFBBBB")
    major_group_color.set("Other", "#8C8B8B")

    const setCanvasDims = (ctx) => {
        const canvas = ctx.canvas
        canvas.width = 825;
        canvas.height = 550;
        console.log("canvas width: ", canvas.width)
        console.log("canvas height: ", canvas.height)
    }
    const drawBBox = (ctx, bbox, labels) => {
        const x1 = bbox[0]
        const y1 = bbox[1]
        const x2 = bbox[2]
        const y2 = bbox[3]
        console.log(bbox)
        ctx.strokeStyle = major_group_color.get(labels);
        ctx.fillStyle = major_group_color.get(labels);
        ctx.globalAlpha = 0.4;
        ctx.lineWidth = 2;
        // strokeRect(x, y, width, height)
        // 6.545 is our scaling from the original image dimensions (5400px x 3600px): we scale it down to (825px x 550px)
        ctx.strokeRect(x1/6.545, y1/6.545, (x2-x1)/6.545, (y2-y1)/6.545);
        ctx.fillRect(x1/6.545, y1/6.545, (x2-x1)/6.545, (y2-y1)/6.545);
        
        bbox_list.push({x: x1/6.545, y: y1/6.545, w: (x2-x1)/6.545, h: (y2-y1)/6.545, color: major_group_color.get(labels), majorgroup: labels})
        setBboxs(bbox_list)
        // ctx.clearRect((x1/6.545)-3, (y1/6.545)-3, ((x2-x1)/6.545)+4, ((y2-y1)/6.545)+4) 
        // -3 because lineWidth is creating a border outside the rect pixels
        // +4 is because the previous line doesnt reach the last line

    };

    const writeText = (ctx, info, style = {}) => {
        const { text, x, y } = info
        const { fontSize = 10, fontFamily = 'Arial', color = 'white', textAlign = 'left', textBaseline = 'top' } = style;
        // ctx.globalAlpha=1.0;
        ctx.beginPath();
        ctx.font = fontSize + 'px ' + fontFamily;
        ctx.textAlign = textAlign;
        ctx.textBaseline = textBaseline;
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
        ctx.stroke();
        ctx.fill();
    }
    
    useEffect(() => {
        console.log("USE EFFECT 2");
    }, [inEdit]);

    useEffect(() => {
        const ctx = canvasRef.current.getContext("2d")
        const text_ctx = textCanvasRef.current.getContext("2d")
        setCanvasDims(ctx);
        setCanvasDims(text_ctx);
        // setInEdit(true);
        setCurrCtx(ctx)

        console.log(testJson)
        for (var i = 0; i < testJson["M12_2_Apr19_3.jpg"].truth.true_boxes.length; i++)
        {
            if(i == 2) {
                continue
            }
            console.log(i)
            var true_labels = testJson["M12_2_Apr19_3.jpg"].truth.true_labels
            var true_bbox = testJson["M12_2_Apr19_3.jpg"].truth.true_boxes
            drawBBox(ctx, true_bbox[i], true_labels[i])
        }
        console.log(bbox_list)

        var hover = false, id;
        var clicked = false;
        var dragging = false;
        var _i, _b;
        function renderMap() {
            for(_i = 0; _b = bbox_list[_i]; _i ++) {
                if(hover && id === _i) {
                    ctx.fillStyle = "white"
                    console.log(_b.majorgroup)
                    setOutputGroup(_b.majorgroup)
                }
                else {
                    ctx.fillStyle = _b.color
                }
                // ctx.fillStyle = (hover && id === _i) ? "red" : _b.color;
                ctx.fillRect(_b.x, _b.y, _b.w, _b.h);
                // setOutputGroup(_b.majorgroup);
            }
        }

        function checkCloseEnough(p1, p2) {
            return Math.abs(p1 - p2) < closeEnough;
        }
        // current issue: clicking event temporarily overrides the color for hover functionality; RESOLVED
        function renderMap2(x, y) {
            // var r = canvasRef.current.getBoundingClientRect(),
            //     x = e.clientX - r.left, y = e.clientY - r.top;
            // 4 cases:
            // 1. top left
            console.log('coords: ', x, y)
            if (checkCloseEnough(x, bboxs[currElement].x) && checkCloseEnough(y, bboxs[currElement].y)) {
                dragTL = true;
                console.log("Dragging top left")
            }
            // 2. top right
            else if (checkCloseEnough(x, bboxs[currElement].x + bboxs[currElement].w) && checkCloseEnough(y, bboxs[currElement].y)) {
                dragTR = true;
                console.log("Dragging top right")
            }
            // 3. bottom left
            else if (checkCloseEnough(x, bboxs[currElement].x) && checkCloseEnough(y, bboxs[currElement].y + bboxs[currElement].h)) {
                dragBL = true;
                console.log("Dragging bottom left")
            }
            // 4. bottom right
            else if (checkCloseEnough(x, bboxs[currElement].x + bboxs[currElement].w) && checkCloseEnough(y, bboxs[currElement].y + bboxs[currElement].h)) {
                dragBR = true;
                console.log("Dragging bottomright")
            }
            // (5.) none of them
            else {
                console.log("None")
                // handle not resizing
            }
            for(_i = 0; _b = bbox_list[_i]; _i ++) {
                if(hover && id === _i) {
                    setCurrElement(_i)
                    setShow(true);
                    ctx.fillStyle = "white";
                }
                else {
                    ctx.fillStyle = _b.color;
                }
                // ctx.fillStyle = (hover && id === _i) ? "red" : _b.color;
                ctx.fillRect(_b.x, _b.y, _b.w, _b.h);
                // setOutputGroup(_b.majorgroup);
            }
        }

        renderMap();
        // canvasRef.current.onmousemove = function(e) {
        //     // Get the current mouse position
        //     var r = canvasRef.current.getBoundingClientRect(),
        //         x = e.clientX - r.left, y = e.clientY - r.top;
        //     hover = false;

        //     ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        //     for(var i = bbox_list.length - 1, b; b = bbox_list[i]; i--) {
        //         if(x >= b.x && x <= b.x + b.w &&
        //         y >= b.y && y <= b.y + b.h) {
        //             // The mouse honestly hits the rect
        //             hover = true;
        //             id = i;
        //             // canvas.addEventListener
        //             break;
        //         }
        //     }
        //     // Draw the rectangles by Z (ASC)
        //     renderMap();
        // }

        canvasRef.current.onmousedown = function(e) {
            var r = canvasRef.current.getBoundingClientRect(),
                x = e.clientX - r.left, y = e.clientY - r.top;
            hover = false;

            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

            for(var i = bbox_list.length - 1, b; b = bbox_list[i]; i--) {
                if(x >= b.x && x <= b.x + b.w &&
                y >= b.y && y <= b.y + b.h) {
                    // The mouse honestly hits the rect
                    hover = true;
                    id = i;
                    setShow(true);
                    setCurrMajorGroup(b.majorgroup);
                    break;
                }
                else{
                    hover = false;
                    setCurrMajorGroup('');
                    setShow(false);
                }
            }
            console.log('coords: ', x, y)
            console.log("ID: ", id)
            // console.log(id)
            if (checkCloseEnough(x, bbox_list[id].x) && checkCloseEnough(y, bbox_list[id].y)) {
                dragging = true;
                dragTL = true;
                console.log("Dragging top left")
            }
            // 2. top right
            else if (checkCloseEnough(x, bbox_list[id].x + bbox_list[id].w) && checkCloseEnough(y, bbox_list[id].y)) {
                dragging = true;
                dragTR = true;
                console.log("Dragging top right")
            }
            // 3. bottom left
            else if (checkCloseEnough(x, bbox_list[id].x) && checkCloseEnough(y, bbox_list[id].y + bbox_list[id].h)) {
                dragging = true;
                dragBL = true;
                console.log("Dragging bottom left")
            }
            // 4. bottom right
            else if (checkCloseEnough(x, bbox_list[id].x + bbox_list[id].w) && checkCloseEnough(y, bbox_list[id].y + bbox_list[id].h)) {
                dragging = true;
                dragBR = true;
                console.log("Dragging bottom right")
            }
            // (5.) none of them
            else {
                dragging = false;
                console.log("None")
                // handle not resizing
            }

            // ctx.clearRect(bbox_list[id].x, bbox_list[id].y, bbox_list[id].w, bbox_list[id].h);

            for(_i = 0; _b = bbox_list[_i]; _i ++) {
                if(hover && id === _i) {
                    setCurrElement(_i)
                    setShow(true);
                    ctx.fillStyle = "white";
                }
                else {
                    ctx.fillStyle = _b.color;
                }
                // ctx.fillStyle = (hover && id === _i) ? "red" : _b.color;
                ctx.fillRect(_b.x, _b.y, _b.w, _b.h);
                // setOutputGroup(_b.majorgroup);
            }
            // renderMap2(x, y);
        }
        
        canvasRef.current.onmouseup = function(e) {
            dragTL = dragBR = dragTR = dragBL = false;
            dragging = false;
            // ctx.clearRect(bbox_list[id].x, bbox_list[id].y, bbox_list[id].w, bbox_list[id].h);
            // if(dragging) {
            //     drawAnchors();
            // }
            for(_i = 0; _b = bbox_list[_i]; _i ++) {
                if(hover && id === _i) {
                    ctx.fillStyle = "white";
                }
                else {
                    ctx.fillStyle = _b.color;
                }
                // ctx.fillStyle = (hover && id === _i) ? "red" : _b.color;
                ctx.fillRect(_b.x, _b.y, _b.w, _b.h);
                // setOutputGroup(_b.majorgroup);
            }
        }

        canvasRef.current.onmousemove = function(e) {
            var r = canvasRef.current.getBoundingClientRect(),
                x = e.clientX - r.left, y = e.clientY - r.top;

            if (dragTL) {
                setShow(true);
                bbox_list[id].w += bbox_list[id].x - x;
                bbox_list[id].h += bbox_list[id].y - y;
                bbox_list[id].x = x;
                bbox_list[id].y = y;
            } else if (dragTR) {
                setShow(true);
                bbox_list[id].w = Math.abs(bbox_list[id].x - x);
                bbox_list[id].h += bbox_list[id].y - y;
                bbox_list[id].y = y;
            } else if (dragBL) {
                setShow(true);
                bbox_list[id].w += bbox_list[id].x - x;
                bbox_list[id].h = Math.abs(bbox_list[id].y - y);
                bbox_list[id].x = x;
            } else if (dragBR) {
                setShow(true);
                bbox_list[id].w = Math.abs(bbox_list[id].x - x);
                bbox_list[id].h = Math.abs(bbox_list[id].y - y);
            }
            // ctx.clearRect(bbox_list[id].x, bbox_list[id].y, bbox_list[id].w, bbox_list[id].h);
            if(dragging) {
                setShow(true);
                // inEdit=true;
                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                drawAnchors();
            }
            else {
                ctx.clearRect(bbox_list[id].x, bbox_list[id].y, bbox_list[id].w, bbox_list[id].h);
                // for(_i = 0; _b = bbox_list[_i]; _i ++) {
                //     if(hover && id === _i) {
                //         ctx.fillStyle = "white";
                //     }
                //     else {
                //         ctx.fillStyle = _b.color;
                //     }
                //     // ctx.fillStyle = (hover && id === _i) ? "red" : _b.color;
                //     ctx.fillRect(_b.x, _b.y, _b.w, _b.h);
                //     // setOutputGroup(_b.majorgroup);
                // }
            }
            draw();
            console.log("inEdit: ", inEdit)
        }

        function draw() {
            if(hover == true) {
                ctx.fillStyle = "white";
            } else {
                ctx.fillStyle = bbox_list[id].color
            }
            ctx.globalAlpha = 0.4;
            ctx.fillRect(bbox_list[id].x, bbox_list[id].y, bbox_list[id].w, bbox_list[id].h)
            // drawAnchors();
        }

        function singleAnchor(x, y, radius) {
            ctx.fillStyle = "#FFFFFF";
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, 2 * Math.PI);
            ctx.fill();
        }

        function clearAnchor(x, y, radius) {
            ctx.globalCompositionOperation = 'destination-out'
            ctx.arc(x, y, radius, 0, 2 * Math.PI);
            ctx.fill();
        }
    
        function drawAnchors() {
            singleAnchor(bbox_list[id].x, bbox_list[id].y, closeEnough) // top left
            singleAnchor(bbox_list[id].x + bbox_list[id].w, bbox_list[id].y, closeEnough) // top right
            singleAnchor(bbox_list[id].x, bbox_list[id].y + bbox_list[id].h, closeEnough) // bottom left
            singleAnchor(bbox_list[id].x + bbox_list[id].w, bbox_list[id].y + bbox_list[id].h, closeEnough) // bottom right

            // clearAnchor(bbox_list[id].x, bbox_list[id].y, closeEnough) // top left
            // clearAnchor(bbox_list[id].x + bbox_list[id].w, bbox_list[id].y, closeEnough) // top right
            // clearAnchor(bbox_list[id].x, bbox_list[id].y + bbox_list[id].h, closeEnough) // bottom left
            // clearAnchor(bbox_list[id].x + bbox_list[id].w, bbox_list[id].y + bbox_list[id].h, closeEnough) // bottom right
        }

        writeText(text_ctx, { text: 'Hi!', x: 200, y: 0 });

    }, []);

    const drawCircle = (ctx, x, y, radius) => {
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fill();
    }

    const drawCircles = (id, ctx) => {
        console.log("CURRENT ELEMENT STUFF: ", bboxs[id].x, bboxs[id].y, bboxs[id].w, bboxs[id].h)
        drawCircle(ctx, bboxs[id].x, bboxs[id].y, closeEnough) // top left
        drawCircle(ctx, bboxs[id].x + bboxs[id].w, bboxs[id].y, closeEnough) // top right
        drawCircle(ctx, bboxs[id].x, bboxs[id].y + bboxs[id].h, closeEnough) // bottom left
        drawCircle(ctx, bboxs[id].x + bboxs[id].w, bboxs[id].y + bboxs[id].h, closeEnough) // bottom right
        setInEdit(true);
        // inEdit = true
        console.log("INEDIT: ", inEdit)
    }

    const dummySave = (id) => {
        setShow(false);
        console.log("SAVED ELEMENT STUFF: ", bboxs[id].x, bboxs[id].y, bboxs[id].w, bboxs[id].h)
        // inEdit = false
        setInEdit(false);
    }

    const dummyNew = (currElement, ctx) => {
        // Create new data point and add to bboxs list
        var to_add_x = canvasRef.current.width/2
        var to_add_y = canvasRef.current.height/2
        var to_add_w = 30
        var to_add_h = 30
        var to_add_color = "#8C8B8B" // this is the 'other' color
        var to_add_majorgroup = "None"
        bboxs.push({x: to_add_x, y: to_add_y, w: to_add_w, h: to_add_h, color: to_add_color, majorgroup: to_add_majorgroup})
        console.log("New bboxs: ", bboxs)

        // Draw the new box
        ctx.strokeStyle = to_add_color;
        ctx.fillStyle = to_add_color;
        ctx.globalAlpha = 0.4;
        ctx.lineWidth = 2;
        // strokeRect(x, y, width, height)
        // 6.545 is our scaling from the original image dimensions (5400px x 3600px): we scale it down to (825px x 550px)
        ctx.strokeRect(to_add_x, to_add_y, to_add_w, to_add_h);
        ctx.fillRect(to_add_x, to_add_y, to_add_w, to_add_h);


        // // Set current id to new box to get ready to edit it
        // drawCircles((bboxs.length-1), ctx)
    }

    const dummySaveFile = () => {
        const currSaveFilepath = window.electronAPI.ipcR.saveFile()
        currSaveFilepath.then(result => {
            console.log("filepath: ", result.filePath)
            fs.writeFileSync(result.filePath, JSON.stringify(projectData), 'utf-8')
        })
        // var fs = require('fs');
        // fs.writeFile("test.txt", jsonData, function(err) {
        //     if (err) {
        //         console.log(err);
        //     }
        // });
        // console.log("Save path: ", currSaveFilepath)
    }

    return (
        <section className='section'>
            <h2>Bounding Box Canvas</h2>
            <Link to='/' className='btn'>
                Home
            </Link><br />
            <div id="wrapper">
                <canvas
                    id="bbox_canvas"
                    ref={canvasRef}
                    style={{
                        width: "825px",
                        height: "550px",
                        background: "url('./photos/M12_2_Apr19_3.jpg')",
                        backgroundSize: "825px 550px"
                    }}
                />
                <canvas
                    id="text_canvas"
                    ref={textCanvasRef}
                    style={{
                        width: "825px",
                        height: "550px",
                        backgroundSize: "825px 550px"
                    }}
                />
                {/* <PureCanvas ref={canvasRef}
                    style={{
                        width: "800px",
                        height: "600px",
                        background: "url('./photos/M12_2_Apr19_3.jpg')",
                    }} /> */}
            </div>
            <div id="temp_legend">
                <img src={require('../photos_src/Capture.PNG')}></img>
            </div>
            <div id="rest">
                <h2>Major Group: {outputGroup}</h2>
                <h2>MouseDown Group: {currMajorGroup}</h2>
                <h2>Test: {bboxs.length}</h2>
                {
                    show && 
                    <button onClick={() => drawCircles(currElement, currCtx)}
                        className="b1"
                    >
                    Edit { /* TODO: inEdit button so that anchors can be drawn while dragging */ }
                    </button>
                }                
                {
                    show && 
                    <button onClick={() => dummySave(currElement)}
                        className="b2"
                    >
                    Save
                    </button>
                }
                <br />
                <button onClick={() => dummyNew(currElement, currCtx)} 
                    className="b3"
                >
                New
                </button>
                <br /> <br />
                <button onClick={() => dummySaveFile()}
                    className="save-file-button"
                >
                    Save Project
                </button>
                {/* create save button */}
            </div>
            {/* <div>
                The mouse is at position{' '}
                <b>
                    ({mousePos.x}, {mousePos.y})
                </b>
            </div> */}
        </section>
    );
};

export default CanvasTest
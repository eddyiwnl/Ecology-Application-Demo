import { Link } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import './CanvasTest.css'
import jsonData from '../model_outputs/test_output.json'

// const PureCanvas = React.forwardRef((props, ref) => <canvas ref={ref} />)

/* TODO
One of two functionalities: 
*/
const CanvasTest = () => {
    var testJson = require('../model_outputs/test_output.json')

    const [outputGroup, setOutputGroup] = useState("") // test output
    const [currElement, setCurrElement] = useState("") // current box id
    const [show, setShow] = useState(false) // show or no show button
    const [bboxs, setBboxs] = useState([]) // bbox_list
    const [currCtx, setCurrCtx] = useState() // current context (usually the canvasRef.current)

    const canvasRef = useRef();
    const textCanvasRef = useRef();

    var bbox_list = []

    var closeEnough = 5
    var dragTL = false;
    var dragBL = false;
    var dragTR = false;
    var dragBR = false;


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
        const ctx = canvasRef.current.getContext("2d")
        const text_ctx = textCanvasRef.current.getContext("2d")
        setCanvasDims(ctx);
        setCanvasDims(text_ctx);

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

                    break;
                }
                else{
                    setShow(false);
                }
            }
            console.log('coords: ', x, y)
            // console.log(id)
            if (checkCloseEnough(x, bbox_list[id].x) && checkCloseEnough(y, bbox_list[id].y)) {
                dragTL = true;
                console.log("Dragging top left")
            }
            // 2. top right
            else if (checkCloseEnough(x, bbox_list[id].x + bbox_list[id].w) && checkCloseEnough(y, bbox_list[id].y)) {
                dragTR = true;
                console.log("Dragging top right")
            }
            // 3. bottom left
            else if (checkCloseEnough(x, bbox_list[id].x) && checkCloseEnough(y, bbox_list[id].y + bbox_list[id].h)) {
                dragBL = true;
                console.log("Dragging bottom left")
            }
            // 4. bottom right
            else if (checkCloseEnough(x, bbox_list[id].x + bbox_list[id].w) && checkCloseEnough(y, bbox_list[id].y + bbox_list[id].h)) {
                dragBR = true;
                console.log("Dragging bottom right")
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
            // renderMap2(x, y);
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
        drawCircle(ctx, bboxs[id].x, bboxs[id].y, closeEnough) // top left
        drawCircle(ctx, bboxs[id].x + bboxs[id].w, bboxs[id].y, closeEnough) // top right
        drawCircle(ctx, bboxs[id].x, bboxs[id].y + bboxs[id].h, closeEnough) // bottom left
        drawCircle(ctx, bboxs[id].x + bboxs[id].w, bboxs[id].y + bboxs[id].h, closeEnough) // bottom right

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
                <h2>MouseDown Group: {currElement}</h2>
                {
                    show && 
                    <button onClick={() => drawCircles(currElement, currCtx)}
                        className="b1"
                    >
                    Test
                    </button>
                }
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
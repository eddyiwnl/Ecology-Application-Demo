import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useState } from "react";
// const { ipcRenderer } = window.require('electron')

// contextBridge.exposeInMainWorld('electronAPI', {
//     openFile: () => ipcRenderer.invoke('dialog:openFile')
// })
// import fs from 'fs'; // Load the File System to execute our common tasks (CRUD)

// var remote = require('electron').remote; // Load remote compnent that contains the dialog dependency
// const { dialog } = require('electron');  // Load the dialogs component of the OS
// fs.readFile('/etc/passwd', (err, data) => {
//     if (err) throw err;
//     console.log(data);
//   });






// var remote = require('electron').remote;
// var fs = remote.require('fs');

  
// remote.dialog.showOpenDialog(remote.getCurrentWindow(),
//    {
//     filters: [
//       {name: 'Images', extensions: ['png']}
//     ]
//    }, 
//    function(filepaths, bookmarks) {
//      //read image (note: use async in production)
//      var _img = fs.readFileSync(filepaths[0]).toString('base64');
//      //example for .png
//      var _out = '<img src="data:image/png;base64,' + _img + '" />';
//      //render/display
//      var _target = document.getElementById('image_container');
//      _target.insertAdjacentHTML('beforeend', _out);

//      return;
// });


// const fs = window.require('fs');
// // var remote = require('electron').remote;
// const axios = require('axios');
 
// dialog.showOpenDialog(getCurrentWindow(),
//    {
//     filters: [
//       {name: 'Images', extensions: ['png']}
//     ]
//    }, 
//    function(filepaths, bookmarks) {
//      //read image (note: use async in production)
//      var _img = fs.readFileSync(filepaths[0]).toString('base64');
//      //example for .png
//      var _out = '<img src="data:image/png;base64,' + _img + '" />';
//      //render/display
//      var _target = document.getElementById('image_container');
//      _target.insertAdjacentHTML('beforeend', _out);

//      return;
// });

// if (global.filepath) {
//          var formData = new FormData();
//          formData.append('file', fs.createReadStream(global.filepath));
//          axios.post('[Custom URL]', formData, {
//          headers: {
//             'Content-Type': 'multipart/form-data'
//            }
//         });
//       }

// const filePath = await window.electronAPI.openFile()

const FileUpload = ({fileName, setFileName}) => {
    // const filePathButton = document.getElementById('filePathButton')
    // const filePathElement = document.getElementById('filePathText')

    // useEffect(() => {
    //     filePathButton.addEventListener('click', async () => {
    //         const filePath = await window.electronAPI.openFile()
    //         filePathElement.innerText = filePath
    //     })
    // })

    const [ filePathText, setFilePathText ] = useState('');
    var fileVars = {};
    function handleOpen(e) {
        const filePath = window.electronAPI.ipcR.openFile()
        console.log(e)
        console.log(filePath)
        filePath.then(result => {
            console.log(result.filePaths)
            fileVars.fileName = result.filePaths
            setFileName(result.filePaths)
        })
        const filePath2 = window.electronAPI.ipcR.on('OPEN_FILE_PATH')
        

        // setFilePathText(filePath)
        console.log(filePath2)

    }

    function pingPongButton(e) {
        window.electronAPI.ipcR.once('ipc-example', (arg) => {
            // eslint-disable-next-line no-console
            console.log(arg); // This prints "IPC test : pong"
          });
        // window.electronAPI.ipcR.asyncMessage()
        window.electronAPI.ipcR.myPing();
        console.log(e) // This prints before "IPC test : pong"???
    }


    return (
        <section className='section'>
            <h2>File-Upload</h2>
            <Link to='/' className='btn'>
                Home
            </Link>
            <br />
            <Button id='filePathButton' onClick={handleOpen}>Upload File</Button>
            {/* <Button onClick={() => {
                ipcRenderer.invoke('async-message', 'ping')
            }}>Test</Button> */}
            <Button onClick={pingPongButton}>Click me</Button>
            <br />
            {console.log(fileVars.fileName)}
            <strong id='filePathText'>File Path: {fileName}</strong>
        </section>
    );
};



export default FileUpload
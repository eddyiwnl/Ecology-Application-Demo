import './App.css';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import DropDown from './pages/DropDown';
import FileUpload from './pages/FileUpload';
import Hovering from './pages/Hovering';
import DropDown2 from './pages/DropDown2'
import ImageDivUpload from './pages/ImageDivUpload';
import JsonUpload from './pages/JsonUpload';
import CanvasTest from './pages/CanvasTest';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
	const [majorgroup, setMajorGroup] = React.useState("")
	const [fileName, setFileName] = React.useState("")
	const [projectData, setProjectData] = React.useState()
  return (
	<HashRouter>
		<div className="App">
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='about' element={<About />} />
				<Route path='dropdown' element={<DropDown majorgroup={majorgroup} setMajorGroup={setMajorGroup}  />} />
				<Route path='fileupload' element={<FileUpload fileName={fileName} setFileName={setFileName} />} />
				<Route path='hovering' element={<Hovering />} />
				<Route path='dropdown2' element={<DropDown2 majorgroup={majorgroup} setMajorGroup={setMajorGroup} />} />
				<Route path='imagedivupload' element={<ImageDivUpload />} />
				<Route path='jsonupload' element={<JsonUpload />} />
				<Route exact path='/canvastest' element={<CanvasTest projectData={projectData} setProjectData={setProjectData}/>} />
				<Route exact path='/FileUploadHTML' render={
					() => {
						window.location.href="FileUploadHTML.html"
					}
				} />
			</Routes>
		</div>
	</HashRouter>
  );
}

export default App;

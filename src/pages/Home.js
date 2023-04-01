import { Link } from "react-router-dom";
// const { ipcRenderer } = window.require('electron');


const Home = () => {
    return (
        <section className='section'>
            <h2>Home</h2>

            <Link to='/about' className='btn'>
                About
            </Link>
            <br></br>
            <Link to='/dropdown' className='btn'>
                Drop Down
            </Link>
            <br />
            <Link to='/fileupload' className='btn'>
                File Upload
            </Link>
            <br />
            <Link to='/hovering' className='btn'>
                Hovering
            </Link>
            <br />
            {/* <button onClick={()=>{
                ipcRenderer.send('asynchronous-message', 'ping')
            }}>Com</button>
            <br /> */}
            <a href="/FileUploadHTML.html">Redirect to Html page</a>
            <br />
            <Link to='/imagedivupload' className='btn'>
                Image Div Upload
            </Link>
            <br />
            <Link to='/jsonupload' className='btn'>
                Json Upload
            </Link>
            <br />
            <Link to='/canvastest' className='btn'>
                Bounding Box Canvas
            </Link>
        </section>

    );
};

export default Home
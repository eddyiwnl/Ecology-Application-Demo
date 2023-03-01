import { Link } from "react-router-dom";
import './ImageDivUpload.css'

const ImageDivUpload = () => {
    return (
        <section className='section'>
            <h2>ImageDivUpload</h2>
            <div id='image-div'>
                <img src={require('../photos/M12_3_Oct19_6a.jpg')} id="img1"></img>
                <div id='bbox1' style={{
                    position: 'absolute',
                    width: 100,
                    height: 50,
                    background: 'red',
                    left: 0,
                    top: 0,
                    height: '7em',
                    opacity: 0.9
                }}>Red box</div>
            </div>
            <Link to='/' className='btn'>
                Home
            </Link>
        </section>
    );
};

export default ImageDivUpload
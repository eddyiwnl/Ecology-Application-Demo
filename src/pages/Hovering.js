import { Link } from "react-router-dom";


const Hovering = () => {
    return (
        <section className='section'>
            <h2>Hovering</h2>
            <Link to='/' className='btn'>
                Home
            </Link>
        </section>
    );
};

export default Hovering
import { Link } from 'react-router-dom';
import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import DropDown from './DropDown';
import { DropDownContext } from "../Context";


const DropDown2 = ({ majorgroup, setMajorGroup }) => {
   // const { majorgroup, setMajorGroup } = React.useContext(DropDownContext)
    const handleChange = (event) => {
        console.log(event);
        setMajorGroup(event);
    };


    return (
        <section className='section'>
            <h2>Drop-Down Box</h2>
            <Link to='/dropdown' className='btn'>
                Back
            </Link>
            <DropdownButton id="dropdown-button-demo" title="Dropdown Button Demo" onSelect={handleChange}>
                <Dropdown.Item eventKey="Amphipoda">Amphipoda</Dropdown.Item>
                <Dropdown.Item eventKey="Bivalvia">Bivalvia</Dropdown.Item>
                <Dropdown.Item eventKey="Cumacea">Cumacea</Dropdown.Item>
                <Dropdown.Item eventKey="Gastropoda">Gastropoda</Dropdown.Item>
                <Dropdown.Item eventKey="Insecta">Insecta</Dropdown.Item>
                <Dropdown.Item eventKey="Ostracoda">Ostracoda</Dropdown.Item>
                <Dropdown.Item eventKey="Polychaeta">Polychaeta</Dropdown.Item>
                <Dropdown.Item eventKey="Other">Other</Dropdown.Item>
            </DropdownButton>
            {/* <messageContext.Provider value={{message, setMessage}}>
                {children}
            </messageContext.Provider> */}
            <h2>Selected Major Group: {majorgroup}</h2>
        </section>
    );
};

export default DropDown2
import { Link } from "react-router-dom";
import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import { DropDownContext } from "../Context";

const DropDown = ({majorgroup, setMajorGroup }) => {
    //const { majorgroup, setMajorGroup } = React.useContext(DropDownContext)
    return (
        <section className='section'>
            <h2>Drop-Down 1</h2>
            <Link to='/' className='btn'>
                page1
            </Link>
            <br />
            <Link to='/dropdown2' className='btn'>
                click me
            </Link>
            <h2>Group: {majorgroup}</h2>
            {/* <Dropdown>
                <Dropdown.Toggle variant="success" id="demo-dropdown">
                    Sample Dropdown
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item href="/">Action</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown> */}
            {/* <DropdownButton id="dropdown-button-demo" title="Dropdown Button Demo">
                <Dropdown.Item href="/">Test1</Dropdown.Item>
                <Dropdown.Item href="/">Test2</Dropdown.Item>
            </DropdownButton> */}
        </section>


    );
};

export default DropDown
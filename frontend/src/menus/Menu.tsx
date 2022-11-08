import { Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';

const Menu = () => {

    return(
        <div className="card menu-list overflow-auto">
            <div className="card-header">
                <h5 className="card-title">Today's Menu</h5>
                <ul className="nav nav-tabs card-header-tabs" data-bs-tabs="tabs">
                    <li className="nav-item">
                        <a className="nav-link active" aria-current="true" data-bs-toggle="tab" href="#dhcp">DHCP</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" data-bs-toggle="tab" href="#static">Static</a>
                    </li>
                </ul>
            </div>
            <form className="card-body tab-content">
                <div className="tab-pane active" id="dhcp">
                    <p className="card-text">Change DHCP Network settings.</p>
                </div>
                <div className="tab-pane" id="static">
                    <p className=" card-text">Change Static Network settings.</p>
                </div>
                <button className="btn btn-primary" type="submit">Save</button>
            </form>
       </div>
    )
}
    


export default Menu;
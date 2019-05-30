import React from 'react';
import './ModalConfirmaton.css';
import {
    NavLink
} from "react-router-dom";

const modal = (props) => {
    return (
        <div  >
            <div className="modal-wrapper"
                style={{
                    transform: props.show ? 'translateY(0vh)' : 'translateY(-100vh)',
                    opacity: props.show ? '1' : '0'
                }}>

                <div className=''>
                    <button className="btn btn-success btn-block" onClick={props.addPanier} >+ Add</button>
                    <NavLink to="/panier"><button className="btn btn-warning btn-block" onClick={props.addPanier} >+ Add and Go To panier</button></NavLink>
                    <button className="btn btn-danger btn-block" onClick={props.close}>Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default modal;

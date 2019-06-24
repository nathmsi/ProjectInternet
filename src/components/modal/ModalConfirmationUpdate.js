import React from 'react';
import './ModalConfirmaton.css'

const modal = (props) => {
    return (
        <div  >
            <div className="modal-wrapper"
                style={{
                    transform: props.show ? 'translateY(0vh)' : 'translateY(-100vh)',
                    opacity: props.show ? '1' : '0'
                }}>

                <div className=''>
                    <button className="btn btn-success btn" onClick={props.updateComputersConfirmation} >Confirmate</button>
                    <button className="btn btn-danger btn" onClick={props.close}>Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default modal;

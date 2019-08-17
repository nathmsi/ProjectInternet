import React from "react"


const AlertTemplate = ({ options, message, close }) => {
    return (
        <div className='container' >
            {options.type === 'info' &&
                (
                    <div className="alert alert-info">
                        <button type="button" onClick={close} className="close" data-dismiss="alert" aria-hidden="true">
                            ×</button>
                        <h4> {message}</h4>
                    </div>
                )
            }
            {options.type === 'success' &&
                (
                    <div className="alert alert-success">
                        <button type="button" onClick={close} className="close" data-dismiss="alert" aria-hidden="true">
                            ×</button>
                        <h4> {message} </h4>
                    </div>
                )
            }
            {options.type === 'error' &&
                (
                    <div className="alert alert-danger">
                        <button type="button" onClick={close} className="close" data-dismiss="alert" aria-hidden="true">
                            ×</button>
                        <span className="glyphicon glyphicon-info-sign"></span> <h3>Error</h3>
                        <h4> {message} </h4>
                    </div>
                )
            }

        </div>

    )
}





export default AlertTemplate
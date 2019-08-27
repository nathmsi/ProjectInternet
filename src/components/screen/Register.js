import React from "react";

const Regiter = ({ username1, password1, password12, email_, handleRegister,
    handleChange }) => {
    return (
        <div className="card card-signin my-5">
            <div className="card-body">
                <h1 className="text-center h1-title" >Register</h1>
                <hr className="my-4" />
                <div className="form-signin">
                    <div className="form-label-group">
                        Username
                        <input type="text" className="inputPassword form-control" name='username1' value={username1} onChange={handleChange} placeholder="Email address" />
                    </div>

                    <div className="form-label-group">
                        Password
                        <input type="password" className="inputPassword form-control" name='password1' value={password1} onChange={handleChange} placeholder="Password" />
                    </div>

                    <div className="form-label-group">
                        Confirmation Password
                        <input type="password" className="inputPassword form-control" name='password12' value={password12} onChange={handleChange} placeholder="Password" />
                    </div>

                    <div className="form-label-group">
                        Email address
                        <input type='email' value={email_} name='email_' className="form-control" onChange={handleChange} />
                    </div>

                    <hr className="my-4" />

                    <button className="btn btn-lg btn-primary btn-block text-uppercase" onClick={() => handleRegister()} >Register</button>


                </div>
            </div>
        </div>
    )
}


export default Regiter;
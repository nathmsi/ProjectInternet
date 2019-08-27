import React from "react";

const Signin = ({ username, password, handleLogin, handleLoginGoogle, handleLoginTwitter, handleSelect , 
    handleChange }) => {
    return (
        <div className="card card-signin my-5">
            <div className="card-body">
            <h1 className="text-center h1-title" >Log-in</h1>
                <hr className="my-4" />
                <div className="form-signin">
                    <div className="form-label-group">
                        Username
                        <input type="text" id="inputEmail" name='username' value={username} onChange={handleChange} className="form-control" placeholder="Email address" required autoFocus />
                    </div>

                    <div className="form-label-group">
                        Password
                        <input type="password" id="inputPassword" name='password' value={password} onChange={handleChange} className="form-control" placeholder="Password" required />
                    </div>
                    <hr className="my-4" />

                    <button className="btn btn-lg btn-primary btn-block text-uppercase" onClick={() => handleLogin(username, password)}>Sign in</button>
                    <button
                        className="btn btn-link"
                        onClick={() => handleSelect('forgot_Password')}
                    >Forgot my password</button>
                    <button className="btn btn-lg btn-google btn-block text-uppercase" onClick={handleLoginGoogle}><i className="fab fa-google mr-2"></i> Sign in with Google</button>
                    <button className="btn btn-lg btn-facebook btn-block text-uppercase" onClick={handleLoginTwitter}><i className="fab fa-twitter-f mr-2"></i> Sign in with Twitter</button>
                </div>
            </div>
        </div>
    )
}


export default Signin;
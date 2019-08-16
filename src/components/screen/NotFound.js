import React from "react";

const NotFound = () => {
    document.title = 'NotFound / Car Sale'
    return (
        <div className="container">
                <div class="hero-unit text-center">
                    <h1>Page Not Found <small><font face="Tahoma" color="red">Error 404</font></small></h1>
                    <br />
                    <h2>The page you requested could not be found, either contact your webmaster or try again. Use your browsers <b>Back</b>
                     button to navigate to the page you have prevously come from</h2>
                    <h3><b>Or you could just press this neat little button:</b></h3>
                    <a href="/" class="btn btn-large btn-info"><i class="icon-home icon-white"></i> Take Me Home</a>
                </div>
        </div>
    )
}


export default NotFound;
import React from "react";

const About  = () =>{
    return (
      <div className="">

        <h1 className="text-center" >
          <small>It's Nice to Meet You!</small>
        </h1>

        <p className="text-center" >Take a look of our beautiful Worker</p>


        <div className="row">
          <div className="col-lg-12">
            <h2 className="text-center" >Our Team</h2>
          </div>
          <br />

          <div className="col-lg-6 text-center col-sm-6 mb-5">
            <h3>Nathan Msika
              <br />
              <small>Engeniering</small>
            </h3>
            <p>Founder of Site Premium Flower</p>
          </div>

          <div className="col-lg-6 text-center col-sm-6 mb-5">
            <h3>Hillel chitrit
             <br />
              <small>Engeniering</small>
            </h3>
            <p>Founder of Site Premium Flower</p>
          </div>

        </div>
      </div>
    )
}


export default About;
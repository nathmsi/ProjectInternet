import React from "react";
 
const Contact = () =>{
    return (
      <section className="content">
                <div className="container">
                    <div className="row">

                        <div className="col-sm-4">
                            <h3>HS Tech Support </h3>
                            <hr></hr>
                            <address>
                                <strong>ISRAEL address:</strong>  <br/>
                                JCT Academia jerusalem technoligy. jerusalem
                                guivat mohdehai <br/>
                                <strong>Phone:</strong> +1-888-414-6658
                            </address>
                            <address>
                                <strong>FRANCE Address:</strong> (Haftungsbeschraenkt/Limited-Liability),
                                Morsering 2, PARIS 80937 FRANCE 
                                <br/><strong>Phone:</strong> +01 151 2757 2810
                            </address>
                        </div>

                        <div className="col-sm-8 contact-form">
                            <form  >
                                <div className="row">
                                    <div className="col-xs-6 col-md-6 form-group">
                                        <input className="form-control"  placeholder="Name"
                                            type="text" required  />
                                    </div>
                                    <div className="col-xs-6 col-md-6 form-group">
                                        <input className="form-control"  placeholder="Email"
                                            type="email" required />
                                    </div>
                                </div>
                                <textarea className="form-control"  placeholder="Message"
                                    rows="5"></textarea>

                                <br/>
                                <div className="row">
                                    <div className="col-xs-12 col-md-12 form-group">
                                        <button className="btn btn-primary pull-right"
                                        type="submit">Send</button>
                                    </div>
                                </div>
                        </form>
                        </div>
                </div> 
                </div>
     </section>
    );
  
}
 
export default Contact;
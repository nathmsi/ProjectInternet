import React, { Component } from 'react'
//api
import { ServerAPI } from "../../api/db"
import { withAlert } from 'react-alert'
import { withRouter } from 'react-router-dom';

class Contact extends Component {

    state = {
        name: '',
        email: '',
        message: ''
    }
    componentDidMount = () => {
        document.title = 'Contact / Computer Sale'
    }


    handleChange = event => {
        const { name, value } = event.target
        this.setState({ [name]: value })
    }

    handleSubmit = async () => {
        try {
            const { email, name, message } = this.state
            if (email !== '' && message !== '' && name !== '') {
                let response = JSON.parse(await ServerAPI('/users/contact', 'POST', {
                    email,
                    name,
                    message
                }))
                this.props.alert.show(response.message)
            } else {
                this.props.alert.error('email name or message missing !!')
            }
        }
        catch (err) {
            console.log(err)
        }
    }

    render() {
        return (
            <section className="content">
                <br /> <br /> <br />
                <div className="">
                    <div className="row">

                        <div className="col-sm-4">
                            <h3>HS Tech Support </h3>
                            <hr></hr>
                            <address>
                                <strong>ISRAEL address:</strong>  <br />
                                JCT Academia jerusalem technoligy. jerusalem
                                guivat mohdehai <br />
                                <strong>Phone:</strong> +1-888-414-6658
                            </address>
                            <address>
                                <strong>FRANCE Address:</strong> (Haftungsbeschraenkt/Limited-Liability),
                                Morsering 2, PARIS 80937 FRANCE
                                <br /><strong>Phone:</strong> +01 151 2757 2810
                            </address>
                        </div>

                        <div className="col-sm-8 contact-form">
                            <div className="row">
                                <div className="col-xs-6 col-md-6 form-group">
                                    <input name='name' type='text' className="form-control"
                                        value={this.state.name}
                                        placeholder='Name of the computer'
                                        onChange={this.handleChange} required />
                                </div>
                                <div className="col-xs-6 col-md-6 form-group">
                                    <input name='email' type='email' className="form-control"
                                        value={this.state.email}
                                        placeholder='Name of the computer'
                                        onChange={this.handleChange} required />
                                </div>
                            </div>
                            <textarea className="form-control" name='message' placeholder="Message" type="text" value={this.state.message} onChange={this.handleChange}
                                rows="5" required></textarea>

                            <br />
                            <div className="row">
                                <div className="col-xs-12 col-md-12 form-group">
                                    <button className="btn btn-primary pull-right" onClick={this.handleSubmit}
                                    >Send</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}


export default withRouter(
    withAlert()(Contact)
)
import React, { Component } from "react";

class Login extends Component {

  state = {
    username: '',
    password: '',
    email: '',
    usernameU: '',
    passwordU: '',
    selected: 'login'
  }

  updateInputValuePassword = (event) => {
    const { value } = event.target
    this.setState({ password: value })
  }
  updateInputValueUsername = (event) => {
    const { value } = event.target
    this.setState({ username: value })
  }

  updateInputValueemail = (event) => {
    const { value } = event.target
    this.setState({ email: value })
  }


  updateInputValuePasswordU = (event) => {
    const { value } = event.target
    this.setState({ passwordU: value })
  }
  updateInputValueUsernameU = (event) => {
    const { value } = event.target
    this.setState({ usernameU: value })
  }


  render() {

    if (this.state.selected === 'login') {
      return (
        <div className="container border">

          <h2 className="h4 text-center py-4">Login</h2>
          <div className="grey-text">



            <div className="row ">
              <div className="col-3">
                <h4 className="input-group-addon">username </h4>
              </div>
              <div className="col-9">
                <input type='text' value={this.state.username} name='username' className="form-control" onChange={this.updateInputValueUsername} />
              </div>
            </div>

            <div className="row ">
              <div className="col-3">
                <h4 className="input-group-addon">password </h4>
              </div>
              <div className="col-9">
                <input type='password' value={this.state.password} name='password' className="form-control" onChange={this.updateInputValuePassword} />
              </div>
            </div>

          </div>

          <div className="row">
            <div className="col-3">
            </div>
            <div className="col-9">
              <button
                className="btn btn-primary btn-lg btn-block"
                onClick={() => { this.props.handleLogin(this.state.username, this.state.password) }}
              >Login</button>
            </div>
          </div>

          <div className="row">
            <div className="col-3">
            </div>
            <div className="col-9">
              <button
                className="btn btn-danger btn-lg btn-block"
                onClick={this.props.handleLoginGoogle}
              >Connect with Google</button>
            </div>
          </div>

          <div className="row">
            <div className="col-3">
            </div>
            <div className="col-9">
              <button
                className="btn btn-warning btn-lg btn-block"
                onClick={() => this.setState({ selected: 'register' })}
              >Register</button>
            </div>
          </div> <br />

        </div>
      )
    } else {
      return (
        <div className="container border">
          <div className="grey-text">
            <p className="h4 text-center py-4">Sign up</p>

            <div className="row ">
              <div className="col-4">
                <h4 className="input-group-addon"> email </h4>
              </div>
              <div className="col-8">
                <input type='email' value={this.state.email} name='email' className="form-control" onChange={this.updateInputValueemail} />
              </div>
            </div>


            <div className="row ">
              <div className="col-4">
                <h4 className="input-group-addon">username </h4>
              </div>
              <div className="col-8">
                <input type='text' value={this.state.usernameU} name='usernameU' className="form-control" onChange={this.updateInputValueUsernameU} />
              </div>
            </div>

            <div className="row ">
              <div className="col-4">
                <h4 className="input-group-addon">password </h4>
              </div>
              <div className="col-8">
                <input type='password' value={this.state.passwordU} name='usernameU' className="form-control" onChange={this.updateInputValuePasswordU} />
              </div>
            </div>

            <div className="row ">
              <div className="col-4">
                <h4 className="input-group-addon">confirmation </h4>
              </div>
              <div className="col-8">
                <input type='password' value={this.state.passwordU} name='passwordU' className="form-control" onChange={this.updateInputValuePasswordU} />
              </div>
            </div>

          </div>

          <div className="row">
            <div className="col-4">
            </div>
            <div className="col-8">
              <button
                className="btn btn-warning btn-lg btn-block"
                onClick={() => { this.props.handleRegister(this.state.usernameU, this.state.passwordU , this.state.email) }}
              >Register</button>
            </div>
          </div>

          <div className="row">
            <div className="col-4">
            </div>
            <div className="col-8">
              <button
                className="btn  btn-primary  btn-lg btn-block"
                onClick={() => this.setState({ selected: 'login' })}
              >Login</button>
            </div>
          </div><br />


        </div>
      )
    }
  };
}

export default Login;
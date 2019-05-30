import React, { Component } from "react";


class Main extends Component {

  state = {
    username: '',
    password: '',
    btnLogin: true,
  }

  updateInputValuePassword = (event) => {
    const { value } = event.target
    this.setState({ password: value })
  }
  updateInputValueUsername = (event) => {
    const { value } = event.target
    this.setState({ username: value })
  }



  handleRegister = () => {
    this.setState({
      btnLogin: false,
    })
  }

  handleLogin = async ()  => {

    var formData = new FormData();
    formData.append('key1', 'value1');
    formData.append('key1', 'value2');

    fetch('http://localhost:9000/nathan', {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data'
        },
        body: formData
    })

  }

  render() {
    const { btnLogin } = this.state
    let btn_login = null

    if (btnLogin) {
      btn_login = <button onClick={this.handleLogin} type="submit" className="btn  btn-lg btn-primary"> Login</button>
    }

    return (
      <>
        <div className="jumbotron centered">
          <div className="container">
            <i className="fas fa-key fa-6x" />
            <h1 className="display-3">Welcome</h1>
            <p className="lead"></p>
            <hr />
            <div className='card-body'>
              <form >
                <div className="form-group">
                  <label>Email</label>
                  <input
                    value={this.state.username}
                    onChange={this.updateInputValueUsername}
                    type="email"
                    className="form-control"
                    name="username" />
                </div>
                <div className="form-group">
                  <label >Password</label>
                  <input
                    value={this.state.password}
                    onChange={this.updateInputValuePassword}
                    type="password"
                    className="form-control"
                    name="password" />
                </div>
                <div className="container">
                  <button
                    type="submit"
                    className="btn btn-light btn-lg"
                    onClick={this.handleRegister} >
                    Register</button>
                  {btn_login}
                </div>
              </form>
            </div>
          </div>
        </div>
      </>

    )
  }

}





export default Main;
import React, { Component } from "react";
import LoadingOverlay from 'react-loading-overlay';
import {withRouter} from 'react-router-dom';


//firebase
import firebase from 'firebase/app'
import 'firebase/auth'
import { firebaseApp } from '../base'


//api
import { ServerAPI } from "../api/db"
class Login extends Component {

  state = {
    username: '',
    password: '',
    email: '',
    code: '',
    usernameU: '',
    passwordU: '',
    selected: 'login',
    codeConf: '',
    isLoading: false,
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

  updateInputValuecodeConf = (event) => {
    const { value } = event.target
    this.setState({ codeConf: value })
  }


  updateInputValuePasswordU = (event) => {
    const { value } = event.target
    this.setState({ passwordU: value })
  }
  updateInputValueUsernameU = (event) => {
    const { value } = event.target
    this.setState({ usernameU: value })
  }

  forgotPassword = async () => {
    this.setState({ selected: 'confcode' })

    let code = Math.floor((Math.random() * 10000) + 999);
    await ServerAPI('/users/forgot', 'POST', {
      email: this.state.email,
      code,
      username: this.state.username
    })
    this.setState({ code: code.toString() })
  }

  checkcode = () => {
    const { codeConf, code } = this.state

    if (codeConf === code && codeConf !== '') {
      this.setState({ selected: 'changpassword' })
    } else {
      alert('wrong code ')
    }
  }

  newpassword = async () => {
    const { passwordU } = this.state
    if (passwordU !== '') {
      let result = JSON.parse(await ServerAPI('/users/newPassword', 'POST', {
        email: this.state.email,
        code: this.state.code,
        username: this.state.username,
        password: passwordU
      }))
      alert(result.message)
      try {
        if (result.success) {
          this.setState({ selected: 'login' })
        } else {
          alert('wrong')
        }
      } catch (err) {
        console.log(err)
      }
    } else {
      alert('set new password')
    }
  }

  

  ///////////// login //////////////////////////////
  handleLogin = async (userName, pass) => {
    if (userName !== '' && pass !== '') {
      this.setState({ isLoading: true })

      let res = await ServerAPI('/users/login', 'POST', {
        'username': userName,
        'password': pass
      })
      console.log(res)
      if (res === 'notAuthorized' || res === 'Bad Request' || res === 'Unauthorized' || res === null) {
        alert('this account not registered you need to registr before')
      } else {
        this.props.setUserAuthName(res,userName) 
        this.setState({ isLoading: false })
        this.props.history.push('/Catalogue')
      }
     
    }else{
    alert('missing username or password')
    this.setState({ isLoading: false })
    }
  }



  handleLoginGoogle = async () => {
    try {
      const authProvider = new firebase.auth.GoogleAuthProvider()
      firebaseApp
        .auth()
        .signInWithPopup(authProvider)
        .then(async authData => {
          this.setState({ isLoading: true })
          let res = await ServerAPI('/users/login', 'POST', {
            'username': authData.additionalUserInfo.profile.email ,
            'password': authData.user.uid
          })
          if (res === 'Unauthorized') {
            this.handleRegister(authData.additionalUserInfo.profile.email, authData.user.uid, authData.additionalUserInfo.profile.email)
          } else {
            this.props.setUserAuthName( res , authData.additionalUserInfo.profile.email)
            this.setState({ isLoading: false })
            this.props.history.push('/Catalogue')
          }
        })
    }
    catch (err) {
      console.log(err)
    }
  }

  handleLoginTwitter = async () => {
    try {
      const authProvider = new firebase.auth.TwitterAuthProvider()
      firebaseApp
        .auth()
        .signInWithPopup(authProvider)
        .then(async authData => {
          this.setState({ isLoading: true })
          let res = await ServerAPI('/users/login', 'POST', {
            'username': this.state.userName,
            'password': this.state.password
          })
          if (res === 'Unauthorized') {
            this.handleRegister(authData.additionalUserInfo.profile.email, authData.user.uid, authData.additionalUserInfo.profile.email)
          } else {
            this.props.setUserAuthName(res,authData.additionalUserInfo.profile.email)
            this.setState({ isLoading: false })
            this.props.history.push('/Catalogue')
          }
        })
    }
    catch (err) {
      console.log(err)
    }
  }

  handleLoginGuitHub = async () => {
    try {
      const authProvider = new firebase.auth.GithubAuthProvider()
      firebaseApp
        .auth()
        .signInWithPopup(authProvider)
        .then(async authData => {
          // this.setState({ isLoading: true })
          // let res = await ServerAPI('/users/login', 'POST', {
          //   'username': this.state.userName,
          //   'password': this.state.password
          // })
          // if (res === 'Unauthorized') {
          //   this.handleRegister(authData.additionalUserInfo.profile.email, authData.user.uid, authData.additionalUserInfo.profile.email)
          // } else {
          //   this.props.setUserAuthName(res,authData.additionalUserInfo.profile.email)
          //   this.setState({ isLoading: false })
          //   this.props.history.push('/Catalogue')
          // }
          console.log(authData)
        })
    }
    catch (err) {
      console.log(err)
    }
  }

  ///////////// register //////////////////////////////
  handleRegister = async (userName, pass, email) => {
    if (userName !== '' && pass !== '' && email !== '') {
      this.setState({ isLoading: true })
      let res = await ServerAPI('/users/register', 'POST', {
        'username': userName,
        'password': pass,
        'level': 'client',
        'email': email
      })

      if (res === 'denied')
        alert('this account is already registered')
      else {
        this.setState({ isLoading: false })
        this.props.setUserAuthName(res,userName)
        this.props.history.push('/Catalogue')
      }
      
    }else
    alert('missing username or password or email')
  }




  



  render() {

    if (this.state.selected === 'login') {
      return (
        <LoadingOverlay
        active={this.state.isLoading}
        spinner
        text='wait ...'
        >
        <div>
          <hr className="style1" />
          <div className="container  border bg-light">
            <h2 className="h4 text-center py-4">Login</h2>
            <div className="grey-text">
              <div className="row ">
                <div className="col-3">
                  <h4 className="input-group-addon text-center">username </h4>
                </div>
                <div className="col-9">
                  <input type='text' value={this.state.username} name='username' className="form-control" onChange={this.updateInputValueUsername} />
                </div>
              </div>


              <div className="row ">
                <div className="col-3">
                  <h4 className="input-group-addon text-center"> password </h4>
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
                  onClick={() => { this.handleLogin(this.state.username, this.state.password) }}
                >Login</button>
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
            </div>

            <br/>

            <div className="container">

              <div className="row">
                <div className="col">
                </div>
                <div className="col">
                </div>
                <div className="col">
                  <button
                    className="btn btn-link"
                    onClick={() => this.setState({ selected: 'forgot' })}
                  >Forgot my password</button>
                </div>
                <div className="col">
                  <button className="btn btn-danger" type="button" onClick={this.handleLoginGoogle}>
                    Sign in with Google+
                    </button>
                </div>
                <div className="col">
                  <button className="btn btn-primary" type="button" onClick={this.handleLoginTwitter}>
                    Sign in with Twitter
                    </button>
                </div>
                <div className="col">
                  <button className="btn btn-dark" type="button" onClick={this.handleLoginGuitHub}>
                    Sign in with GuitHub
                    </button>
                </div>
              </div>
            </div>

            <br />

          </div>
        </div></LoadingOverlay>
      )
    } else if (this.state.selected === 'forgot') {
      return (
        <LoadingOverlay
        active={this.state.isLoading}
        spinner
        text='wait ...'
      >
        <div>
          <hr className="style1" />
          <div className="container border bg-light">
            <div className="grey-text">
              <p className="h4 text-center py-4 text-center">Forgot Password </p>

              <div className="row ">
                <div className="col-4">
                  <h4 className="input-group-addon text-center"> email </h4>
                </div>
                <div className="col-8">
                  <input type='email' value={this.state.email} name='email' className="form-control" onChange={this.updateInputValueemail} />
                </div>
              </div>

              <div className="row ">
                <div className="col-4">
                  <h4 className="input-group-addon text-center"> uername </h4>
                </div>
                <div className="col-8">
                  <input type='email' value={this.state.username} name='email' className="form-control" onChange={this.updateInputValueUsername} />
                </div>
              </div>



            </div>

            <div className="row">
              <div className="col-4">
              </div>
              <div className="col-8">
                <button
                  className="btn  btn-primary  btn-lg btn-block"
                  onClick={this.forgotPassword}
                > Submit </button>
              </div>
            </div>

            <div className="row">
              <div className="col-4">
              </div>
              <div className="col-8">
                <button
                  className="btn btn-link"
                  onClick={() => this.setState({ selected: 'login' })}
                >Login</button>
              </div>
            </div>

            <br />


          </div>
        </div></LoadingOverlay>
      )
    }
    else if (this.state.selected === 'confcode') {
      return (
        <LoadingOverlay
        active={this.state.isLoading}
        spinner
        text='wait ...'
      >
        <div>
          <hr className="style1" />
          <div className="container border bg-light">
            <div className="grey-text">
              <p className="h4 text-center py-4"> Confirmation code send Email address </p>

              <div className="row ">
                <div className="col-4">
                  <h4 className="input-group-addon"> code  </h4>
                </div>
                <div className="col-8">
                  <input type='email' value={this.state.codeConf} name='codeConf' className="form-control" onChange={this.updateInputValuecodeConf} />
                </div>
              </div>


            </div>

            <div className="row">
              <div className="col-4">
              </div>
              <div className="col-8">
                <button
                  className="btn  btn-primary  btn-lg btn-block"
                  onClick={this.checkcode}
                > Submit </button>
              </div>
            </div>

            <div className="row">
              <div className="col-4">
              </div>
              <div className="col-8">
                <button
                  className="btn btn-link"
                  onClick={() => this.setState({ selected: 'login' })}
                >Login</button>
              </div>
            </div>
            <br />


          </div>
        </div></LoadingOverlay>
      )
    }
    else if (this.state.selected === 'changpassword') {
      return (
        <LoadingOverlay
        active={this.state.isLoading}
        spinner
        text='wait ...'
      >
        <div>
          <hr className="style1" />
          <div className="container border bg-light">
            <div className="grey-text">
              <p className="h4 text-center py-4"> Chang password </p>

              <div className="row ">
                <div className="col-4">
                  <h4 className="input-group-addon  text-center">new password </h4>
                </div>
                <div className="col-8">
                  <input type='password' value={this.state.passwordU} name='usernameU' className="form-control" onChange={this.updateInputValuePasswordU} />
                </div>
              </div>

              <div className="row ">
                <div className="col-4">
                  <h4 className="input-group-addon  text-center">new password confirmation </h4>
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
                  onClick={this.newpassword}
                >Chang password</button>
              </div>
            </div>

            <div className="row">
              <div className="col-4">
              </div>
              <div className="col-8">
                <button
                  className="btn btn-link"
                  onClick={() => this.setState({ selected: 'login' })}
                >Login</button>
              </div>
            </div>

            <br />


          </div>
        </div>
        </LoadingOverlay>
      )
    }
    else {
      return (
        <LoadingOverlay
        active={this.state.isLoading}
        spinner
        text='wait ...'
      >
        <div>
          <hr className="style1" />
          <div className="container border bg-light">
            <div className="grey-text">
              <p className="h4 text-center py-4">Sign up</p>

              <div className="row ">
                <div className="col-4">
                  <h4 className="input-group-addon  text-center"> email </h4>
                </div>
                <div className="col-8">
                  <input type='email' value={this.state.email} name='email' className="form-control" onChange={this.updateInputValueemail} />
                </div>
              </div>


              <div className="row ">
                <div className="col-4">
                  <h4 className="input-group-addon  text-center">username </h4>
                </div>
                <div className="col-8">
                  <input type='text' value={this.state.usernameU} name='usernameU' className="form-control" onChange={this.updateInputValueUsernameU} />
                </div>
              </div>

              <div className="row ">
                <div className="col-4">
                  <h4 className="input-group-addon  text-center">password </h4>
                </div>
                <div className="col-8">
                  <input type='password' value={this.state.passwordU} name='usernameU' className="form-control" onChange={this.updateInputValuePasswordU} />
                </div>
              </div>

              <div className="row ">
                <div className="col-4">
                  <h4 className="input-group-addon  text-center">confirmation </h4>
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
                  onClick={() => { this.handleRegister(this.state.usernameU, this.state.passwordU, this.state.email) }}
                >Register</button>
              </div>
            </div>

            <div className="row">
              <div className="col-4">
              </div>
              <div className="col-8">
                <button
                  className="btn btn-link"
                  onClick={() => this.setState({ selected: 'login' })}
                >Login</button>
              </div>
            </div>

            <br />


          </div>
        </div>
        </LoadingOverlay>
      )
    }
  };
}

export default withRouter(Login);
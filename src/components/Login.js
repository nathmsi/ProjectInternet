import React, { Component } from "react";
import LoadingOverlay from 'react-loading-overlay';
import { withRouter } from 'react-router-dom';
import { withAlert } from 'react-alert'

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

  componentDidMount = ()=>{
    document.title = 'Login / Car Sale'
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
    try {
      this.setState({ isLoading: true })

      let code = Math.floor((Math.random() * 10000) + 999);
      let response = JSON.parse(await ServerAPI('/users/forgot', 'POST', {
        email: this.state.email,
        code,
        username: this.state.username
      }))
      //alert(response.message)
      this.props.alert.show(response.message)
      if (response.success === true) {
        this.setState({ code: code.toString(), selected: 'confcode', isLoading: false })
      } else {
        this.setState({  isLoading: false })
      }
    } catch (err) {
      console.log(err)
      this.setState({ selected: 'login', isLoading: false })
    }

  }

  checkcode = () => {
    this.setState({ isLoading: true })
    const { codeConf, code } = this.state

    if (codeConf === code && codeConf !== '') {
      this.setState({ selected: 'changpassword' })
      this.setState({ isLoading: false })
    } else {
      this.props.alert.error('wrong code ')
      this.setState({ isLoading: false })
    }
  }

  newpassword = async () => {
    try {
      this.setState({ isLoading: true })
      const { passwordU, password } = this.state
      if (passwordU !== '') {
        if (password === passwordU) {
          let result = JSON.parse(await ServerAPI('/users/newPassword', 'POST', {
            email: this.state.email,
            code: this.state.code,
            username: this.state.username,
            password: passwordU
          }))
          //alert(result.message)
          this.props.alert.show('result ' + result.message)
          try {
            if (result.success) {
              this.setState({ selected: 'login' })
              this.setState({ isLoading: false })
            } else {
              //alert('wrong')
              this.props.alert.error('wrong')
              this.setState({ isLoading: false })
            }
          } catch (err) {
            console.log(err)
            this.setState({ isLoading: false })
          }
        } else {
          this.props.alert.error('confirmation password not matching')
          this.setState({ isLoading: false })
        }
      } else {
        //alert('set new password')
        this.props.alert.show('set new password')
        this.setState({ isLoading: false })
      }
    } catch (err) {
      console.log(err)
      this.setState({ selected: 'login', isLoading: false })
    }
  }



  ///////////// login //////////////////////////////
  handleLogin = async (userName, pass) => {
    try {
    if (userName !== '' && pass !== '') {
      this.setState({ isLoading: true })


      let res = await ServerAPI('/users/login', 'POST', {
        'username': userName,
        'password': pass
      })
      console.log(res)
      if (res === 'notAuthorized' || res === 'Bad Request' || res === 'Unauthorized' || res === null) {
        this.props.alert.error('this account not registered you need to registr before')
        this.setState({ isLoading: false })
      } else {
        this.props.alert.success('welcome ' + userName,{
          timeout : 1200
        })
        this.props.setUserAuthName(res, userName)
        this.setState({ isLoading: false })
        this.props.history.push('/Catalogue')
      }

    } else {
      this.props.alert.error('missing username or password')
      this.setState({ isLoading: false })
    }
  } catch (err) {
    console.log(err)
    this.setState({ selected: 'login', isLoading: false })
  }
  }



  handleLoginGoogle = async () => {
    try {
      this.setState({ isLoading: true })
      const authProvider = new firebase.auth.GoogleAuthProvider()
      await firebaseApp
        .auth()
        .signInWithPopup(authProvider)
        .then(async authData => {
          this.setState({ isLoading: true })
          let res = await ServerAPI('/users/login', 'POST', {
            'username': authData.additionalUserInfo.profile.email,
            'password': authData.user.uid
          })
          if (res === 'Unauthorized') {
            this.handleRegister(authData.additionalUserInfo.profile.email, authData.user.uid, authData.additionalUserInfo.profile.email, authData.user.uid)
          } else {
            this.props.alert.success('welcome ' + authData.additionalUserInfo.profile.email)
            this.props.setUserAuthName(res, authData.additionalUserInfo.profile.email)
            this.setState({ isLoading: false })
            this.props.history.push('/Catalogue')
          }
        })
        .catch(err => {
          this.setState({ isLoading: false })
          console.log(err)
        })
    }
    catch (err) {
      this.setState({ isLoading: false })
      console.log(err)
    }
  }

  handleLoginTwitter = async () => {
    try {
      this.setState({ isLoading: true })
      const authProvider = new firebase.auth.TwitterAuthProvider()
      firebaseApp
        .auth()
        .signInWithPopup(authProvider)
        .then(async authData => {
          let res = await ServerAPI('/users/login', 'POST', {
            'username': authData.additionalUserInfo.username,
            'password': authData.credential.accessToken
          })
          if (res === 'Unauthorized') {
            this.handleRegister(authData.additionalUserInfo.username, authData.credential.accessToken, '', authData.credential.accessToken)
            this.setState({ isLoading: false })
          } else {
            this.props.alert.success('welcome ' + authData.additionalUserInfo.username )
            this.props.setUserAuthName(res, authData.additionalUserInfo.username)
            this.setState({ isLoading: false })
            this.props.history.push('/Catalogue')
          }
        })
        .catch(err => {
          console.log(err)
          this.setState({ isLoading: false })
        })
    }
    catch (err) {
      this.setState({ isLoading: false })
      console.log(err)
    }
  }



  ///////////// register //////////////////////////////
  handleRegister = async (userName, pass, email, passConf) => {
    if (userName !== '' && pass !== '' && email !== '' && passConf !== '') {
      if (passConf === pass) {
        this.setState({ isLoading: true })
        let res = await ServerAPI('/users/register', 'POST', {
          'username': userName,
          'password': pass,
          'level': 'client',
          'email': email
        })

        if (res === 'denied') {
          this.props.alert.error('this account already registered')
          this.setState({ isLoading: false })
        }
        else {
          this.props.setUserAuthName(res, userName)
          this.setState({ isLoading: false })
          this.props.history.push('/Catalogue')
        }
      } else {
        this.props.alert.error('problem password or username  not correct ')
        this.setState({ isLoading: false })
      }

    } else {
      this.props.alert.error('missing username , password or email')
      this.setState({ isLoading: false })
    }
  }








  render() {

    if (this.state.selected === 'login') {
      return (
        <LoadingOverlay
          active={this.state.isLoading}
          spinner
          text={<h2 className='text-dark'>Please wait a few time ...</h2>}
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

              <br />

              <div className="container">

                <div className="row">
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
                    <input type='password' value={this.state.password} name='usernameU' className="form-control" onChange={this.updateInputValuePassword} />
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
                    <input type='password' value={this.state.password} name='usernameU' className="form-control" onChange={this.updateInputValuePassword} />
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
                    onClick={() => { this.handleRegister(this.state.usernameU, this.state.passwordU, this.state.email, this.state.password) }}
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

export default withRouter(
  withAlert()(Login)
)

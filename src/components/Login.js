import React, { Component } from "react";
import LoadingOverlay from 'react-loading-overlay';
import { withRouter } from 'react-router-dom';
import { withAlert } from 'react-alert'

//firebase
import firebase from 'firebase/app'
import 'firebase/auth'
import { firebaseApp } from '../base'

// screen
import Signin from './screen/SignIn'
import Register from './screen/Register'


import "../styles/Login.css";



//api
import { ServerAPI } from "../api/db"

class Login extends Component {


    state = {
        username: '',
        password: '',
        email_: '',
        code: '',
        username1: '',
        password1: '',
        password12: '',
        selected: 'login',
        codeConf: '',
        isLoading: false,
        isConnected: false
    }

    componentDidMount = async () => {
        document.title = 'Login / Car Sale'
        await this.getUserAuth()
    }

    getUserAuth = async () => {
        try {
            let userAuth = await ServerAPI('/users/level', 'get')
            console.log('session Login  : ' + userAuth)
            //let userName = await ServerAPI('/users/username', 'get')
            if (userAuth === 'manager' || userAuth === 'client' || userAuth === 'creator') {
                //this.props.alert.show('You are already login ' + userName)
                this.props.pathTo('/Catalogue')
            } else {
                this.setState({ isConnected: true })
                this.props.setUserAuthName('basic', 'Visitor')
            }
        }
        catch (err) {
            console.log('session error : ' + err)
        }
    }



    handleChange = event => {
        const { name, value } = event.target
        this.setState({ [name]: value })
    }


    forgotPassword = async () => {
        try {
            this.setState({ isLoading: true })

            let code = Math.floor((Math.random() * 10000) + 999);
            let response = JSON.parse(await ServerAPI('/users/forgot', 'POST', {
                email: this.state.email_,
                code,
                username: this.state.username
            }))
            //alert(response.message)
            this.props.alert.show(response.message)
            if (response.success === true) {
                this.setState({ code: code.toString(), selected: 'confcode', isLoading: false })
            } else {
                this.setState({ isLoading: false })
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
            const { password1, password12 } = this.state
            if (password1 !== '') {
                if (password1 === password12) {
                    let result = JSON.parse(await ServerAPI('/users/newPassword', 'POST', {
                        email: this.state.email_,
                        code: this.state.code,
                        username: this.state.username,
                        password: password1
                    }))
                    try {
                        if (result.success) {
                            this.props.alert.show(result.message)
                            this.setState({ selected: 'login' })
                            this.setState({ isLoading: false, selected: 'login' })
                        } else {
                            //alert('wrong')
                            this.props.alert.error('wrong')
                            this.props.alert.show(result.message)
                            this.setState({ isLoading: false, selected: 'login' })
                        }
                    } catch (err) {
                        console.log(err)
                        this.setState({ isLoading: false, selected: 'login' })
                    }
                } else {
                    this.props.alert.error('confirmation password not matching')
                    this.setState({ isLoading: false })
                }
            } else {
                //alert('set new password')
                this.props.alert.show('set new password')
                this.setState({ isLoading: false, selected: 'login' })
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
                if (res === 'client' || res === 'manager' || res === 'creator') {
                    console.log( 'login : ' + userName + ' userAuth : ' + res )
                    this.props.alert.success('welcome ' + userName)
                    this.props.setUserAuthName(res, userName)
                    this.props.getCountPanier()
                    this.setState({ isLoading: false })
                    this.props.history.push('/Catalogue')
                } else {
                    console.log( 'error : ' + res )
                    this.props.alert.error('Username or password not correct')
                    this.setState({ isLoading: false })
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
            let firebaseapp = firebaseApp()
            if (firebaseapp !== 'error') {
                await firebaseapp
                    .auth()
                    .signInWithPopup(authProvider)
                    .then(async authData => {
                        this.setState({ isLoading: true })
                        let res = await ServerAPI('/users/login', 'POST', {
                            'username': authData.additionalUserInfo.profile.email,
                            'password': authData.user.uid
                        })
                        if (res === 'Unauthorized') {
                            this.setState({
                                username1: authData.additionalUserInfo.profile.email,
                                password1: authData.user.uid,
                                password12: authData.user.uid,
                                email_: authData.additionalUserInfo.profile.email
                            })
                            this.handleRegister()
                        } else {
                            this.props.alert.success('welcome ' + authData.additionalUserInfo.profile.email)
                            this.props.getCountPanier()
                            this.props.setUserAuthName(res, authData.additionalUserInfo.profile.email)
                            this.setState({ isLoading: false })
                            this.props.history.push('/Catalogue')
                        }
                    })
                    .catch(err => {
                        this.setState({ isLoading: false })
                        console.log(err)
                    })
            } else {
                this.props.alert.error('we have a problem to access to google')
                this.setState({ isLoading: false })
            }
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
            let firebaseapp = firebaseApp()
            if (firebaseapp !== 'error') {
                await firebaseapp
                    .auth()
                    .signInWithPopup(authProvider)
                    .then(async authData => {
                        let res = await ServerAPI('/users/login', 'POST', {
                            'username': authData.additionalUserInfo.username,
                            'password': authData.credential.accessToken
                        })
                        if (res === 'Unauthorized') {
                            this.setState({
                                username1: authData.additionalUserInfo.username,
                                password1: authData.credential.accessToken,
                                password12: authData.credential.accessToken,
                                email_: authData.additionalUserInfo.profile.email
                            })
                            this.handleRegister()
                            this.setState({ isLoading: false })
                        } else {
                            this.props.alert.success('welcome ' + authData.additionalUserInfo.username)
                            this.props.setUserAuthName(res, authData.additionalUserInfo.username)
                            this.setState({ isLoading: false })
                            this.props.history.push('/Catalogue')
                        }
                    })
                    .catch(err => {
                        console.log(err)
                        this.setState({ isLoading: false })
                    })
            } else {
                this.props.alert.error('we have a problem to access to google')
                this.setState({ isLoading: false })
            }
        }
        catch (err) {
            this.setState({ isLoading: false })
            console.log(err)
        }
    }



    ///////////// register //////////////////////////////
    handleRegister = async () => {
        const { username1, password1, password12, email_ } = this.state
        if (username1 !== '' && password1 !== '' && email_ !== '' && password12 !== '') {
            if (password1 === password12) {
                this.setState({ isLoading: true })
                let res = await ServerAPI('/users/register', 'POST', {
                    'username': username1,
                    'password': password1,
                    'level': 'client',
                    'email': email_
                })

                if (res === 'denied') {
                    this.props.alert.error('this account already registered')
                    this.setState({ isLoading: false })
                }
                else {
                    this.props.getCountPanier()
                    this.props.setUserAuthName(res, username1)
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

    handleSelect = (selected) => this.setState({ selected })



    getColor_register = (selected) => (selected === "register" ? `buttonRadius btn btn-lg btn-primary btn-block text-uppercase ` : `buttonRadius btn btn-lg btn-light btn-block text-uppercase `)
    getColor_login = (selected) => (selected === "login" ? `buttonRadius btn btn-lg btn-primary btn-block text-uppercase ` : `buttonRadius btn btn-lg btn-light btn-block text-uppercase `)




    render() {
        const { username, password, username1, selected } = this.state

        return (
            <LoadingOverlay
                active={this.state.isLoading}
                spinner
                text={<h2 className='text-dark'>Please wait a few time ...</h2>}
            >
                {
                    this.state.isConnected === true
                    &&
                    <div className='container '>
                        <div className="row">
                            <div className="col ">
                                <div className="col">
                                    {/* {
                                    selected === 'register' &&
                                    <Register username={username1} password1={this.state.password1} password12={this.state.password12} email_={this.state.email_} handleRegister={this.handleRegister}
                                        handleChange={this.handleChange} handleSelect={this.handleSelect} />
                                } */}
                                    {
                                        selected === 'login' &&
                                        <Signin username={username} password={password} handleLogin={this.handleLogin} handleLoginGoogle={this.handleLoginGoogle}
                                            handleLoginTwitter={this.handleLoginTwitter}
                                            handleChange={this.handleChange} handleSelect={this.handleSelect} />
                                    }
                                    {
                                        selected === 'forgot_Password' &&
                                        <Forgot username={username} email_={this.state.email_} handleChange={this.handleChange}
                                            forgotPassword={this.forgotPassword} handleSelect={this.handleSelect} />
                                    }
                                    {
                                        selected === 'confcode' &&
                                        <ConfCode codeConf={this.state.codeConf} handleChange={this.handleChange}
                                            checkcode={this.checkcode} handleSelect={this.handleSelect} />
                                    }
                                    {
                                        selected === 'changpassword' &&
                                        <ChangPassword password1={this.state.password1} password12={this.state.password12} handleChange={this.handleChange}
                                            newpassword={this.newpassword} handleSelect={this.handleSelect} />
                                    }
                                </div>
                            </div>
                            <div className="col">
                                <div className="col">
                                    <Register username={username1} password1={this.state.password1} password12={this.state.password12} email_={this.state.email_} handleRegister={this.handleRegister}
                                        handleChange={this.handleChange} handleSelect={this.handleSelect} />
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </LoadingOverlay>
        )
    }
}

const Forgot = ({ handleChange, username, email_, forgotPassword, handleSelect }) => {
    return (
        <div className="card card-signin my-5">
            <div className="card-body">
                <p className="h4 text-center py-4 text-center">Forgot Password </p>
                <div className="form-label-group">
                    Email
                <input type='email' value={email_} name='email_' className="form-control" onChange={handleChange} />
                </div>
                <div className="form-label-group">
                    Username
                <input type='email' value={username} name='username' className="form-control" onChange={handleChange} />
                </div>
                <hr className="my-4" />

                <button
                    className="btn  btn-primary  btn-lg btn-block"
                    onClick={forgotPassword}
                > Submit </button>
                <button
                    className="btn btn-link"
                    onClick={() => handleSelect('login')}
                >Login</button>
            </div>
        </div>
    )
}

const ConfCode = ({ handleChange, codeConf, checkcode, handleSelect }) => {
    return (
        <div className="card card-signin my-5">
            <div className="card-body">
                <p className="h4 text-center py-4 text-center">Confirmation code send Email address </p>
                <div className="form-label-group">
                    Enter the code confirmation
                <input type='email' value={codeConf} name='codeConf' className="form-control" onChange={handleChange} />
                </div>
                <hr className="my-4" />
                <button
                    className="btn  btn-primary  btn-lg btn-block"
                    onClick={checkcode}
                > Submit </button>
                <button
                    className="btn btn-link"
                    onClick={() => handleSelect('login')}
                >Login</button>
            </div>
        </div>
    )
}

const ChangPassword = ({ handleChange, password1, password12, handleSelect, newpassword }) => {
    return (
        <div className="card card-signin my-5">
            <div className="card-body">
                <p className="h4 text-center py-4 text-center">Confirmation code send Email address </p>
                <div className="form-label-group">
                    Password
                <input type='password' value={password1} name='password1' className="form-control" onChange={handleChange} />
                </div>

                <div className="form-label-group">
                    Confirmation Password
                <input type='password' value={password12} name='password12' className="form-control" onChange={handleChange} />
                </div>
                <hr className="my-4" />
                <button
                    className="btn  btn-primary  btn-lg btn-block"
                    onClick={newpassword}
                > Submit </button>

                <button
                    className="btn btn-link"
                    onClick={() => handleSelect('login')}
                >Login</button>
            </div>
        </div>
    )
}

export default withRouter(
    withAlert()(Login)
)

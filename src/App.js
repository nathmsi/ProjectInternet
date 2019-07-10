import React, { Component } from "react";
import LoadingOverlay from 'react-loading-overlay';
import {
  Route,
  withRouter,
  // BrowserRouter as Router
} from "react-router-dom";



import NavBar from "./components/NavBar";
import Footer from "./components/screen/Footer";
import Catalogue from "./components/Catalogue";
import About from "./components/screen/About";
import Contact from "./components/screen/Contact";
import UserGestion from "./components/UserGestion";
import Login from "./components/Login";
import Panier from "./components/Panier";
import Account from "./components/myAccount";
import Blog from "./components/chat/Blog";
import CatalogueUserGestion from './components/CatalogueGestion'
import Home from "./components/screen/Home";
import OrderGestion from './components/OrderGestion'

//api
import {
  loginDatabase,
  registerDatabase
} from "./api/db"

//firebase
import firebase from 'firebase/app'
import 'firebase/auth'
import { firebaseApp } from './base'

class App extends Component {

  state = {
    userAuth: 'basic',
    userName: '',
    password: '',
    isActive: true,
    isLoading: false,
  }

  async componentDidMount() {
    this.getUserAuth()
  }

  getUserAuth = async () => {
    try{
    let userAuth = await fetch('/users/level', { method: 'get' })
      .then(res => res.text())
      .catch(err => console.log('session error : ' + err))
    let userName = await fetch('/users/username', { method: 'get' })
      .then(res => res.text())
      .catch(err =>   console.log('session error : ' + err))
      console.log('session : ' + userAuth)
      this.setState({ userAuth: userAuth, userName: userName })
    }
    catch(err){
      console.log('session error : ' + err)
    }
    console.log('<App> isAuth : ' + this.state.userAuth)
  }


  handleLogin = async (userName, pass) => {
    this.setState({ isLoading: true })
    this.setState({ userName: userName, password: pass })
    let res = await loginDatabase(userName, pass)
    console.log(res)
    if (res === 'notAuthorized' || res === 'Bad Request' || res === 'Unauthorized' || res === null) {
      alert('this account not registered you need to registr before')
    } else {
      this.setState({ userAuth: res })
      this.props.history.push('/Catalogue')
    }
    this.setState({ isLoading: false })
    console.log('<App> isAuth : ' + this.state.userAuth)
  }



  handleLoginGoogle = async () => {
    try {
      const authProvider = new firebase.auth.GoogleAuthProvider()
      firebaseApp
        .auth()
        .signInWithPopup(authProvider)
        .then(async authData => {
          this.setState({ isLoading: true })
          this.setState({ userName: authData.additionalUserInfo.profile.email, password: authData.user.uid })
          let res = await loginDatabase(this.state.userName, this.state.password)
      
          if (res === 'Unauthorized') {
            this.handleRegister(this.state.userName, this.state.password, this.state.userName)
          } else {
            this.setState({ userAuth: res })
            this.setState({ isLoading: false })
            console.log('<App> isAuth : ' + this.state.userAuth)
            this.props.history.push('/Catalogue')
          }
        })
    }
    catch (err) {
      console.log(err)
    }
  }

  handleRegister = async (userName, pass, email) => {
    this.setState({ isLoading: true })
    this.setState({ userName: userName, password: pass })
    let res = await registerDatabase(userName, pass, email, 'client')

    if (res === 'denied')
      alert('this account is already registered')
    else {
      this.setState({ userAuth: res })
      this.props.history.push('/Catalogue')
    }
    this.setState({ isLoading: false })

  }



  handleLogout = async () => {
    this.setState({ isLoading: true })
    await fetch('/users/logout', { method: 'get' }).catch(err => err)
    this.setState({ userName: 'visitor', password: '', userAuth: 'basic' })
    this.props.history.push('/Login')
    this.setState({ isLoading: false })
  }



  render() {
    const { userAuth } = this.state

    return (
      <LoadingOverlay
          active={this.state.isLoading}
          spinner
          text='wait ...'
        >
      <div className="backgroungStyle" >

        <NavBar
          handleLogout={this.handleLogout}
          userAuth={userAuth}
          handleLogin={this.handleLogin}
          userName={this.state.userName} />

        <hr className="style1" /><hr className="style1" /><hr className="style1" />

        
          <hr className="style1" />
          <div className="content " >
            <Route exact path="/" component={Home}></Route>
            <Route exact path="/Catalogue" component={Catalogue} />
            <Route exact path="/UserGestion" component={UserGestion} />
            <Route exact path="/OrderGestion" component={OrderGestion} />
            <Route exact path="/CatalogueGestion" component={CatalogueUserGestion} />
            <Route exact path="/About" component={About} />
            <Route exact path="/contact" component={Contact} />
            <Route exact path="/Panier" component={Panier} />
            <Route exact path="/Account" component={Account} />
            <Route exact path="/Blog" component={Blog} />
            <Route exact path="/Login" render={() => <Login handleLogin={this.handleLogin} handleRegister={this.handleRegister} handleLoginGoogle={this.handleLoginGoogle} />} />
          </div>


      
        <Footer />
       

      </div>
      </LoadingOverlay>


    );
  }
}

export default withRouter(App);
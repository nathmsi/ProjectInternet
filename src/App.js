import React, { Component } from "react";

import {
  Route,
  withRouter,
  Switch
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
import NotFound from './components/screen/NotFound'

//api
import { ServerAPI } from "./api/db"


class App extends Component {

  state = {
    userAuth: 'basic',
    userName: 'Visitor',
    password: '',
    isActive: true,
    isLoading: false,
  }

  async componentDidMount() {
    this.getUserAuth()
  }

  getUserAuth = async () => {
    try {
      let userAuth = await ServerAPI('/users/level', 'get')
      let userName = await ServerAPI('/users/username', 'get')
      if (userAuth === 'manager' || userAuth === 'client' || userAuth === 'creator') {
        console.log('session : ' + userAuth)
        this.setState({ userAuth: userAuth, userName: userName })
      }
    }
    catch (err) {
      console.log('session error : ' + err)
    }
    console.log('<App> isAuth : ' + this.state.userAuth)
  }



  handleLogout = async () => {
    this.setState({ isLoading: true })
    this.setState({ userName: 'visitor', userAuth: 'basic' })
    await ServerAPI('/users/logout', 'get')
    this.props.history.push('/Login')
    this.setState({ isLoading: false })
  }

  setUserAuthName = (userAuth, userName) => {
    this.setState({ userAuth, userName })
  }

  pathTo = (path) => {
    this.props.history.push(path)
  }

  isLogin = () =>{
    const { userAuth } = this.state
    if (userAuth === 'manager' || userAuth === 'client' || userAuth === 'creator') {
      return true
    }else{
      return false
    }
  }


  render() {

    const { userAuth, userName } = this.state

    return (
      <div className="backgroungStyle" >
        <NavBar handleLogout={this.handleLogout} userAuth={userAuth} userName={userName} />
        <div className="content" >
          <Switch>
            <Route exact path="/" render={() => <Home pathTo={this.pathTo} isLogin={this.isLogin}/>} />
            <Route exact path="/Catalogue" component={Catalogue} />
            <Route exact path="/UserGestion" component={UserGestion} />
            <Route exact path="/OrderGestion" component={OrderGestion} />
            <Route exact path="/CatalogueGestion" component={CatalogueUserGestion} />
            <Route exact path="/About" component={About} />
            <Route exact path="/contact" component={Contact} />
            <Route exact path="/Panier" component={Panier} />
            <Route exact path="/Account" component={Account} />
            <Route exact path="/Blog" component={Blog} />
            <Route exact path="/Login" render={() => <Login setUserAuthName={this.setUserAuthName} isLogin={this.isLogin} pathTo={this.pathTo} userName={this.state.userName} />} />
            <Route component={NotFound} />
          </Switch>
        </div>
        <Footer />
      </div>
    )

  }
}

export default withRouter(App);
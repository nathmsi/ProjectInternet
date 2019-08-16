import React, { Component } from "react"
import LoadingOverlay from 'react-loading-overlay';
import '../styles/Catalogue.css'
import User from './screen/User'

import { withAlert } from 'react-alert'

import { ServerAPI } from "../api/db"

class UserGestion extends Component {

  state = {
    users: '',
    userAuth: 'basic',
    myID: '',
    isLoading: true,
    isActive: true,
    username: ''
  }



  async componentDidMount() {
    try {
      document.title = 'UserGestion / Car Sale'
      let account = JSON.parse(await ServerAPI('/users/account/', 'get'))
      if (account.level === 'creator') {
        this.getData()
        this.setState({ isLoading: false, userAuth: account.level, myID: account._id, username: account.username })
        console.log('<UserGestion> isAuth : ' + account.level)
      }
      else {
        this.setState({ userAuth: 'basic' })
        console.log('<UserGestion> isAuth : ' + account.level)
        this.props.history.push('/Login')
      }
      this.setState({ isActive: false })
    }
    catch (err) {
      console.log(err)
      this.props.history.push('/Login')
    }

  }

  getData = async () => {
    const users = await ServerAPI('/users/', 'get')
    var mydata = JSON.parse(users)
    this.setState({ users: mydata })
  }

  deleteUser = async key => {
    this.setState({ isActive: true })
    if (key !== this.state.myID) {
      await ServerAPI('/users/delete', 'POST', { id: key })
      this.getData()
    } else {
      this.props.alert.error(this.state.username + ' is your Account cannot update')
    }
    this.setState({ isActive: false })
  }

  updateUserLevel = async (key, level) => {
    if (key !== this.state.myID) {
      this.setState({ isActive: true })
      await ServerAPI('/users/level', 'POST', { id: key, level })
      this.getData()
      this.setState({ isActive: false })
    } else {
      this.props.alert.error(this.state.username + ' is your Account cannot update')
    }
  }



  render() {


    const { userAuth } = this.state
    let users = <></>

    if (userAuth === 'creator') {
      users = Object.keys(this.state.users)
        .map(key => <User key={key} uid={key} details={this.state.users[key]} deleteUser={this.deleteUser} updateUserLevel={this.updateUserLevel} ></User>)
    }

    return (
      <LoadingOverlay
        active={this.state.isActive}
        spinner
        styles={{ background: 'red' }}
        text={<h2 className='text-dark'>Please wait a few time ...</h2>}
      >
        
            <div className='cards computerUpdateList'>
              {users}
            </div>
          
      </LoadingOverlay>
    )

  }


}



export default withAlert()(UserGestion);
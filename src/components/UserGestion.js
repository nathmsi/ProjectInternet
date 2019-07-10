import React, { Component } from "react";
import CircularProgress from '@material-ui/core/CircularProgress';
import LoadingOverlay from 'react-loading-overlay';
import '../styles/Catalogue.css'
import User from './screen/User'
import { dbUsersList, dbDeleteUser, dbupdateUserLevel } from '../api/db'

class UserGestion extends Component {

  state = {
    users: '',
    userAuth: 'basic',
    isLoading: true,
    isActive: false
  }



  async componentDidMount() {
    let userAuth = await fetch('/users/level', { method: 'get' })
      .then(res => res.text())
    this.setState({ userAuth: userAuth })

    if (userAuth === 'manager')
    {
      this.getData()
      this.setState({ isLoading: false })
      console.log('<UserGestion> isAuth : ' + userAuth)
    }
    else{  
        this.setState({ userAuth: 'basic' })
        console.log('<UserGestion> isAuth : ' + userAuth)
        this.props.history.push('/Login') 
    }

  }

  getData = async () => {
    const users = await dbUsersList()
    var mydata = JSON.parse(users)
    this.setState({ users: mydata })
  }

  deleteUser = async key => {
    await dbDeleteUser(key)
    this.getData()
  }

  updateUserLevel = async (key, level) => {
    this.setState({isActive : true})
    await dbupdateUserLevel(key, level)
    this.getData()
    this.setState({isActive : false})
  }



  render() {
    if (this.state.isLoading === false) {
      const { userAuth } = this.state
      let users = <div><p>Vous n'avez pas acces a cette page </p></div>

      if (userAuth === 'manager') {
        users = Object.keys(this.state.users)
          .map(key => <User key={key} uid={key} details={this.state.users[key]} deleteUser={this.deleteUser} updateUserLevel={this.updateUserLevel} ></User>)
      }

      return (
        <LoadingOverlay
          active={this.state.isActive}
          spinner
          styles = {{background : 'red'}}
          text='Loading your content...'
        >
        <div className='cards computerUpdateList'>
            {users}
        </div>


        </LoadingOverlay>
      );

    } else {

      return (
        <div className='text-center'>
           <p>Wait ...</p>
          <CircularProgress disableShrink />
        </div>
      )

    }


  }


}



export default UserGestion;
import React, { Component } from "react";
import LoadingOverlay from 'react-loading-overlay';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { withAlert } from 'react-alert'

import { ServerAPI } from "../api/db"

class MyAcount extends Component {

  state = {
    id: '',
    username: '',
    newpassword: '',
    newpasswordC: '',
    oldpassword: '',
    level: '',
    phone: '',
    address: '',
    email: '',
    panier: [],
    orders: [],
    userAuth: 'basic',
    isLoading: true,
    isActive: true,
    isGoogleAuth: false,
    mulertImage: ''
  }

  componentDidMount = async () => {
    try {
      document.title = 'Myaccount / Car Sale'
      await this.getSession()
      if (this.state.userAuth === 'manager' || this.state.userAuth === 'client' || this.state.userAuth === 'creator') {
        await this.getAccount()
        this.setState({ isActive: false })
        console.log('<Myaccount> isAuth : ' + this.state.userAuth)
      }
      else {
        this.setState({ userAuth: 'basic' })
        console.log('<Myaccount> isAuth : ' + this.state.userAuth)
        this.setState({ isActive: false })
        this.props.history.push('/Login')
      }
    }
    catch (err) {
      console.log(err)
      this.setState({ isActive: false })
      this.props.history.push('/Login')
    }
  }

  getSession = async () => {
    let userAuth = await ServerAPI('/users/level', 'get')
    this.setState({ userAuth: userAuth })
  }

  getAccount = async () => {
    try {
      let account = JSON.parse(await ServerAPI('/users/account/', 'get'))
      this.setState({
        username: account.username, level: account.level, panier: account.panier,
        orders: account.orders, id: account._id,
        address: account.address, phone: account.phone, email: account.email,
        mulertImage: account.imageUser
      })
      if (account.username === account.email) this.setState({ isGoogleAuth: true })
    }
    catch (err) {
      console.log(err)
      this.props.history.push('/Login')
    }
  }


  updateInputValueLevel = (event) => {
    const { value } = event.target
    this.setState({ level: value })
  }
  updateInputValueUsername = (event) => {
    const { value } = event.target
    this.setState({ username: value })
  }

  updateInputValuePhone = (event) => {
    const { value } = event.target
    this.setState({ phone: value })
  }

  updateInputValueAdress = (event) => {
    const { value } = event.target
    this.setState({ address: value })
  }

  updateInputValuePassword = (event) => {
    const { value } = event.target
    this.setState({ newpassword: value })
  }

  updateInputValuePasswordC = (event) => {
    const { value } = event.target
    this.setState({ newpasswordC: value })
  }

  updateInputValueoldpassword = (event) => {
    const { value } = event.target
    this.setState({ oldpassword: value })
  }

  updateInputValueemail = (event) => {
    const { value } = event.target
    this.setState({ email: value })
  }




  handleapplicate = async () => {
    this.setState({ isActive: true })
    let response = JSON.parse(await ServerAPI('/users/update', 'POST', { ...this.state }))
    this.setState({ isActive: false })
    this.props.alert.show(response.message)
  }

  handleChangePassword = async () => {
    if (this.state.newpassword === this.state.newpasswordC) {
      this.setState({ isActive: true })

      let response = JSON.parse(await ServerAPI('/users/changepassword', 'POST', {
        oldpassword: this.state.oldpassword,
        newpassword: this.state.newpassword,
        id: this.state.id
      }))

      this.setState({ isActive: false, oldpassword: '', newpassword: '', newpasswordC: '' })
      this.props.alert.show(response.message)
    } else {
      this.props.alert.show('not the same password')
    }
  }

  deleteOrder = async (index) => {
    let orders = this.state.orders
    orders.splice(index, 1);
    this.setState({ orders: orders })
  }

  deletePanier = async () => {
    this.setState({ panier: [] })
  }


  requireImage(chemin) {
    try {
      var parts = chemin.split('\\')
      var lastSegment = parts.pop() || parts.pop()
      return require(`../img/uploadsImage/user/${lastSegment}`)
    } catch (err) {
      return require(`../img/uploadsImage/user/default-img.jpg`)
    }
  }

  // function to upload image once it has been captured
  uploadImage(e) {
    let imageFormObj = new FormData();
    let imageName = "multer-image-" + Date.now()

    imageFormObj.append("imageName", imageName);
    imageFormObj.append("imageData", e.target.files[0]);
    imageFormObj.append("id", this.state.id);

    let path = e.target.files[0].name

    axios.post(`/image/uploadmulter`, imageFormObj)
      .then((data) => {
        if (data.data.success) {
          this.setState({
            multerImage: path
          })
        }
      })
      .catch((err) => {
        this.props.alert.error("Error while uploading image using multer ")
        console.log(err)
      });

  }






  render() {
    const { orders, username, level, phone, address, newpassword, newpasswordC, email, oldpassword, userAuth } = this.state
    let user, changepassword = <></>
    let Orders = <></>
    let levelInput = <></>

    if (((userAuth === 'manager') || (userAuth === 'client') || (userAuth === 'creator'))) {


      Orders = Object.keys(orders)
        .map(key => <Order key={key} total={orders[key].total} index={key} id={orders[key].order} deleteOrder={this.deleteOrder} />)


      if (userAuth === 'manager') {
        levelInput = <div className="row bg-white">
          <div className="col-2">
            <h3 className="input-group-addon text-center ">level </h3>
          </div>
          <div className="col-10">
            <input type='text' value={level || ''} name='level' className="form-control" onChange={this.updateInputValueLevel} />
          </div>
        </div>
      }

      if (!this.state.isGoogleAuth) {

        user = <div className="row bg-white">
          <div className="col-2">
            <h3 className="input-group-addon text-center ">username </h3>
          </div>
          <div className="col-10">
            <input type='text' value={username || ''} name='username' className="form-control" onChange={this.updateInputValueUsername} />
          </div>
        </div>

        changepassword =
          <div className="row bg-white">
            <div className="col-2">
              <h3 className="input-group-addon text-center "> Change Password  </h3>
            </div>
            <div className="col-10">
              <input type='password' value={oldpassword || ''} placeholder='old password' name='password' className="form-control" onChange={this.updateInputValueoldpassword} />
              <input type='password' value={newpassword || ''} placeholder='new password' name='password' className="form-control" onChange={this.updateInputValuePassword} />
              <input type='password' value={newpasswordC || ''} placeholder='confirm new password' name='password' className="form-control" onChange={this.updateInputValuePasswordC} />
              <button className='btn btn-success ' onClick={this.handleChangePassword} > Change password </button>
            </div>
          </div>
      }
    }

    return (
      <LoadingOverlay
        active={this.state.isActive}
        spinner
        text={<h2 className='text-dark'>Please wait a few time ...</h2>}
      >
        {
          this.state.isActive === false  &&
          (
              <div className="container">

                <h1 className="text-center ">My account</h1>

                <div className="grey-text">
                  <br />

                  <div className="row">
                    <div className="col-4 text-center">
                      <img src={this.requireImage(this.state.mulertImage)} alt='upload-' width="300" height="300" className='process_image text-center rounded-circle' />
                    </div>
                    <div className="col-8 ">
                      <input type='file' className='process_upload-btn text-center ' onChange={(e) => this.uploadImage(e)} />
                    </div>
                  </div>

                  <br /><br />

                  {user}
                  {levelInput}
                  <div className="row bg-white">
                    <div className="col-2">
                      <h3 className="input-group-addon text-center "> phone </h3>
                    </div>
                    <div className="col-10">
                      <input type='text' value={phone || ''} name='phone' className="form-control" onChange={this.updateInputValuePhone} />
                    </div>
                  </div>

                  <div className="row bg-white">
                    <div className="col-2">
                      <h3 className="input-group-addon text-center "> address </h3>
                    </div>
                    <div className="col-10">
                      <input type='text' value={address || ''} name='address' className="form-control" onChange={this.updateInputValueAdress} />
                    </div>
                  </div>

                  <div className="row bg-white">
                    <div className="col-2">
                      <h3 className="input-group-addon text-center "> email </h3>
                    </div>
                    <div className="col-10">
                      <input type='email' value={email || ''} name='email' className="form-control" onChange={this.updateInputValueemail} />
                    </div>
                  </div>


                  {changepassword}

                  <div className="row bg-white">
                    <div className="col-2">
                      <h3 className="input-group-addon text-center ">Shoping Cart </h3>
                    </div>
                    <div className="col-10 bg-white">
                      count element {this.state.panier.length} <br />
                      <button className='btn btn-success text-center ' onClick={this.deletePanier} > Delete Panier </button>
                    </div>

                  </div>



                  <div className="row bg-white">
                    <div className="col-2">
                      <h3 className="input-group-addon text-center "> my last orders </h3>
                    </div>
                    <div className="col-10 AccountOrderScrool">
                      {Orders}
                    </div>
                  </div>

                </div>
                <div className="row ">
                  <div className="col-2">
                  </div>
                  <div className="col-10">
                    <button
                      className="btn btn-primary btn-lg btn-block"
                      onClick={() => { this.handleapplicate() }}
                    >Save</button>
                  </div>
                </div>
                <br /><br />
              </div>
            )
        }
      </LoadingOverlay>
    )

  }
}



const Order = ({ index, total, deleteOrder }) => {
  return (
    <div className='container border bg-white'>
      Order {(parseInt(index) + 1)} <br />
      <strong> Total =>   {total} $ </strong>
      <button className='btn btn-danger ' onClick={() => deleteOrder(index)} > - Delete </button>
      <br />
    </div>
  )
}


export default withRouter(
  withAlert()(MyAcount)
)

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
    mulertImage: '',
    SelectedOptiion: 'account'
  }

  componentDidMount = async () => {
    try {
      document.title = 'Myaccount / Computer Sale'
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

  handleSelect = (value) => {
    this.setState(
      {
        SelectedOptiion: value
      }
    )
  }






  render() {
    const { orders, username, level, phone, address, newpassword, newpasswordC, email, oldpassword, userAuth } = this.state
    let user = <></>
    let Orders = <></>
    let levelInput = <></>
    let accountElement = <></>

    if (((userAuth === 'manager') || (userAuth === 'client') || (userAuth === 'creator'))) {


      Orders = Object.keys(orders)
        .map(key => <Order key={key} total={orders[key].total} index={key} id={orders[key].order} deleteOrder={this.deleteOrder} />)


      if (userAuth === 'creator') {
        levelInput =
          <div className="form-label-group">
            Level
                        <input type='text' className="inputPassword form-control" value={level || ''} name='level' onChange={this.updateInputValueLevel} />
          </div>
      }

      accountElement = <>
        <img src={this.requireImage(this.state.mulertImage)} alt='upload-' width="150" height="150" className='process_image text-center rounded-circle' />
        <button className="btn btn-link" onClick={() => this.handleSelect('Order')}>Last Orders</button> <br />
        <input type='file' className='process_upload-btn text-center ' onChange={(e) => this.uploadImage(e)} />  <br />
      </>


      if (!this.state.isGoogleAuth) {
        user =
          <div className="form-label-group">
            Username
        <input type='text' value={username || ''} name='username' className="inputPassword form-control" onChange={this.updateInputValueUsername} />
          </div>


      }
    }

    return (
      <LoadingOverlay
        active={this.state.isActive}
        spinner
        text={<h2 className='text-dark'>Please wait a few time ...</h2>}
      >
        <div className='container '>
          <div className=' container'>
            <div className="row">
              <div className="col">
                <div className="card card-signin my-5">
                  <div className="card-body">

                    {
                      this.state.SelectedOptiion === 'Password'
                      &&

                      <div className="form-label-group">
                        <h1 className="text-center h1-title" >Change My Password</h1>
                        old password <input type='password' value={oldpassword || ''} placeholder='old password' name='password' className="inputPassword form-control" onChange={this.updateInputValueoldpassword} />
                        new password<input type='password' value={newpassword || ''} placeholder='new password' name='password' className="inputPassword form-control" onChange={this.updateInputValuePassword} />
                        confirm new password <input type='password' value={newpasswordC || ''} placeholder='confirm new password' name='password' className="inputPassword form-control" onChange={this.updateInputValuePasswordC} />
                        <button className="btn btn-success btn-lg btn-block" onClick={this.handleChangePassword} > Change password </button>
                        <button className="btn btn-link" onClick={() => this.handleSelect('account')}>Back</button>
                      </div>
                    }

                    {
                      this.state.SelectedOptiion === 'account'
                      &&
                      <>
                        <h1 className="text-center h1-title" >My Account</h1>
                        {accountElement}
                        {user}
                        {levelInput}
                        <div className="form-label-group">
                          Phone
                    <input type='text' value={phone || ''} name='phone' className="inputPassword form-control" onChange={this.updateInputValuePhone} />
                        </div>
                        <div className="form-label-group">
                          Address
                    <input type='text' value={address || ''} name='address' className="inputPassword form-control" onChange={this.updateInputValueAdress} />
                        </div>
                        <div className="form-label-group">
                          Email
                    <input type='email' value={email || ''} name='email' className="inputPassword form-control" onChange={this.updateInputValueemail} />
                        </div>
                        <button className="btn btn-link" onClick={() => this.handleSelect('Password')}>Change Password</button>
                      </>
                    }

                    {
                      this.state.SelectedOptiion === 'Order'
                      &&
                      <>
                        <h1 className="text-center h1-title" >My Order</h1>
                        <div className="form-label-group">
                          <h4>Shoping Cart </h4>
                          count element {this.state.panier.length}  &nbsp;  &nbsp;
                           <button className='btn btn-success text-center ' onClick={this.deletePanier} > Delete Panier </button>
                        </div>
                        <div className="form-label-group">
                          <h4>my last orders</h4>
                          <div className=" AccountOrderScrool">
                            {Orders}
                          </div>
                        </div>
                        <button className="btn btn-link" onClick={() => this.handleSelect('account')}>Back</button>
                      </>
                    }

                    <button className="btn btn-primary btn-lg btn-block" onClick={() => { this.handleapplicate() }}  >Save</button>


                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </LoadingOverlay>
    )

  }
}



const Order = ({ index, total, deleteOrder }) => {
  return (
    <div className='container  '>
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

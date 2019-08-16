import React, { Component } from "react";
import '../styles/Catalogue.css'

import LoadingOverlay from 'react-loading-overlay';
import { ServerAPI } from "../api/db"

import Modal from "./screen/modalDialog"
import PaypalButton from './payment/PaypalButton';
import { withRouter } from 'react-router-dom';
import { withAlert } from 'react-alert'


const CLIENT = {
  sandbox: process.env.REACT_APP_PAYPAL_CLIENT_ID_SANDBOX,
  production: process.env.REACT_APP_PAYPAL_CLIENT_ID_PRODUCTION,
};
const ENV = process.env.NODE_ENV === 'production'
  ? 'production'
  : 'sandbox';


class Panier extends Component {



  state = {
    computers: {},
    userAuth: 'basic',
    panier: [],
    isLoading: true,
    show: false,
    total: '0',
    paymentActive: false
  }

  async componentDidMount() {
    try {
      document.title = 'ShoppingCart / Car Sale'
      await this.getSession()
      if (this.state.userAuth === 'manager' || this.state.userAuth === 'client' || this.state.userAuth === 'creator') {
        await this.getData()
        await this.getPanier()
        console.log('<UserGestion> isAuth : ' + this.state.userAuth)
        this.setState({ isActive: false })
      } else {
        this.setState({ userAuth: 'basic' })
        console.log('<UserGestion> isAuth : ' + this.state.userAuth)
        this.props.history.push('/Login')
      }
    } catch (err) {
      console.log(err)
      this.props.history.push('/Login')
    }
  }

  getSession = async () => {
    let userAuth = await ServerAPI('/users/level', 'get')
    this.setState({ userAuth: userAuth })
  }

  getData = async () => {
    const computer = await ServerAPI('/computers/', 'get')
    var mydata = JSON.parse(computer);
    this.setState({ computers: mydata })
  }

  getPanier = async () => {
    let panier = JSON.parse(await ServerAPI('/users/panier/', 'get'))
    this.setState({ panier: panier })
  }


  removePanierElement = async key => {
    this.setState({ isActive: true })
    await ServerAPI('/users/panier/delete', 'POST', { id: key })
    this.getPanier()
    this.setState({ isActive: false })
  }

  requireImage(chemin) {
    try {
      var parts = chemin.split('\\')
      var lastSegment = parts.pop() || parts.pop()
      return require(`../img/uploadsImage/${lastSegment}`)
    } catch (err) {
      return require(`../img/default.jpg`)
    }
  }


  handleChangeCountRemove = async (id) => {
    this.setState({ isActive: true })
    await ServerAPI('/users/panier/deleteOne', 'POST', { id })
    this.getPanier()
    this.setState({ isActive: false })
  }

  handleChangeCountAdd = async (id) => {
    this.setState({ isActive: true })
    await ServerAPI('/users/panier/add', 'POST', { id })
    this.getPanier()
    this.setState({ isActive: false })
  }

  handleCheckorder = (total) => {
    if (this.state.panier.length > 0) {
      this.setState({
        total,
        show: true,
        paymentActive: true
      })
    } else {
      this.props.alert.show('your shopping cart is empty please check your article')
    }
  }

  handlePurshase = async () => {
    try {
      this.setState({ isActive: true, show: false })
      let total = this.state.total
      if (this.state.panier.length > 0) {
        let date = new Date()
        let day = date.getDay()
        let month = date.getMonth()
        let years = date.getFullYear()
        let hours = date.getHours()
        let minutes = date.getMinutes()

        this.state.panier.forEach(async id => {
          await ServerAPI('/computers/stock/delete', 'POST', { id })
        });

        await ServerAPI('/users/orders/add', 'POST', {
          order: [...this.state.panier], total,
          date: {
            day, month, years, hours, minutes
          }
        })
        await this.getPanier()
        this.setState({ isActive: false })
      } else {
        this.setState({ isActive: false })
        this.props.alert.show('your shopping cart is empty please check your article')
      }
    } catch (err) {
      console.log(err)
      this.setState({ isActive: false })
    }
  }


  getRecurance = (list, value) => {
    var count = (input, arr) => arr.filter(x => x === input).length;
    return count(value, list)
  }

  goToCatalogue = () => {
    this.props.history.push('/Catalogue')
  }

  handleClose = () => { this.setState({ show: false }) }
  handleOpen = () => { this.setState({ show: true }) }


  onSuccess = (payment) => {
    //console.log('Successful payment!', payment);
    this.props.alert.success('Successful payment!')
    this.setState({
      show: false,
      paymentActive: false
    })
  }


  onError = (error) => {
    this.props.alert.error('Erroneous payment OR failed to load script!')
    //console.log('Erroneous payment OR failed to load script!', error);
    this.setState({
      show: false,
      paymentActive: false
    })
  }


  onCancel = () => {
    try {
      this.props.alert.show('Cancelled payment!')
      //console.log('Cancelled payment!', data);
      this.setState({
        show: false,
        paymentActive: false
      })
    } catch (err) {
      console.log('Cancelled payment! error : ', err);
    }
  }


  render() {
    const { computers, panier, userAuth } = this.state
    let cards = []
    let cards_ = <></>
    let total = 0
    let totalCount = <></>

    if ((userAuth === 'manager') || (userAuth === 'client') || (userAuth === 'creator')) {

      Object.keys(computers)
        .forEach(key => {
          if (panier.includes(computers[key]._id)) {
            computers[key].count = this.getRecurance(panier, computers[key]._id)
            cards.push(computers[key])
          }
        })

      cards_ = Object.keys(cards)
        .map(key => <Lignepanier key={key} car={cards[key]} handleChange={this.handleChange} requireImage={this.requireImage} removePanierElement={this.removePanierElement}
          handleChangeCountRemove={this.handleChangeCountRemove} handleChangeCountAdd={this.handleChangeCountAdd} />)
      Object.keys(cards).forEach(key => {
        total = total + parseInt(cards[key].price * cards[key].count)
      })

      totalCount = <Total total={total} handleCheckorder={this.handleCheckorder} history={this.goToCatalogue}></Total>
    }


    return (
      <LoadingOverlay
        active={this.state.isActive}
        spinner
        text={<h2 className='text-dark'>Please wait a few time ...</h2>}
      >
              <div className='panierScrool bg-light'>
                <table className="table table-bordred table-striped  bg-light">
                  <thead>
                    <tr>
                      <th align="center">image</th>
                      <th align="center">Name</th>
                      <th align="center">Price</th>
                      <th align="center">Count</th>
                      <th align="center">Subtotal</th>
                      <th align="center">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cards_}
                    {totalCount}
                  </tbody>
                </table>
              </div>


              {
                !this.state.paymentActive ?
                  <></>
                  :
                  (
                    < Modal show={this.state.show} handleClose={this.handleClose} handleSubmit={this.handlePurshase}
                      // eslint-disable-next-line
                      title={"Confirmation Checkout" + "  Total price is : " + this.state.total + '$'}  >
                      <div>
                        <PaypalButton
                          client={CLIENT}
                          env={ENV}
                          commit={true}
                          currency={'USD'}
                          total={this.state.total}
                          onSuccess={this.onSuccess}
                          onError={this.onError}
                          onCancel={this.onCancel}
                        />
                      </div>
                    </Modal>
                  )
              }


      </LoadingOverlay>
    );

  }
}




const Lignepanier = ({ car, removePanierElement, requireImage, handleChangeCountAdd, handleChangeCountRemove }) => {

  return (
    <tr>
      <td align="left">  <img src={requireImage(car.image)} alt={car.name} width="193" height="130" /></td>

      <td align="left"> {car.name} </td>

      <td align="left"> {car.price} $ </td>

      <td align="left">
        <button type="button" onClick={() => handleChangeCountRemove(car._id)} className="btn btn-secondary btn-outline-light btn-sm">-</button>
        &nbsp;{car.count} &nbsp;
          <button type="button" onClick={() => handleChangeCountAdd(car._id)} className="btn btn-secondary btn-outline-light btn-sm">+</button>
      </td>

      <td align="left"> {car.price * car.count} $ </td>

      <td align="left" className="id_dir">
        <button className="btn btn-danger " onClick={() => removePanierElement(car._id)} data-title="Delete">Delete</button>
      </td>

    </tr>
  )
}

const Total = ({ total, handleCheckorder, history }) => {
  return (
    <tr>

      <td align="left">  <button className="btn btn-warning btn-lg font-weight-bold" onClick={history}> Continue Shopping<i className="fa fa-angle-right"></i></button></td>

      <td align="left">  </td>

      <td align="left">  </td>

      <td align="left">  </td>

      <td align="left">     <strong className="">TOTAL [ {total} $ ]</strong></td>

      <td align="left">     <button onClick={() => handleCheckorder(total)} className="btn btn-success btn-lg font-weight-bold">Checkout <i className="fa fa-angle-right"></i></button></td>

    </tr>
  )
}




export default withRouter(
  withAlert()(Panier)
)

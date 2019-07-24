import React, { Component } from "react";
import '../styles/Catalogue.css'

import LoadingOverlay from 'react-loading-overlay';
import { ServerAPI } from "../api/db"



class Panier extends Component {



  state = {
    computers: {},
    userAuth: 'basic',
    panier: [],
    isLoading: true
  }

  async componentDidMount() {
    try {
      await this.getSession()
      if (this.state.userAuth === 'manager' || this.state.userAuth === 'client' || this.state.userAuth === 'creator') {
        this.getData()
        this.getPanier()
        console.log('<UserGestion> isAuth : ' + this.state.userAuth)
        this.setState({ isActive: false })
      } else {
        this.setState({ userAuth: 'basic' })
        console.log('<UserGestion> isAuth : ' + this.state.userAuth)
        this.props.history.push('/Login')
      }
      this.setState({ isLoading: false })
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
      return require(`../img/uploadsImage/default-img.jpg`)
    }
  }

  handleChange = (e, id) => {

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

  handleCheckorder = async (total) => {
    try {
      this.setState({ isActive: true })
      if (this.state.panier.length > 0) {
        let date = new Date(Date.now())
        let day = date.getDay()
        let month = date.getMonth()
        let years = date.getFullYear()
        let hours = date.getHours()
        let minutes = date.getMinutes()

        await ServerAPI('/users/orders/add', 'POST', {
          order: [...this.state.panier], total,
          date: {
            day, month, years, hours, minutes
          }
        })
        this.getPanier()
        this.setState({ isActive: false })
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
        text='Loading your content...'
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




export default Panier;
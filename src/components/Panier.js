import React, { Component } from "react";
import '../styles/Catalogue.css'
import CircularProgress from '@material-ui/core/CircularProgress';

import {  ServerAPI} from "../api/db"  



class Panier extends Component {



  state = {
    computers: {},
    userAuth: 'basic',
    panier: [],
    isLoading: true
  }

  async componentDidMount() {
    await this.getSession()
    if (this.state.userAuth === 'manager' || this.state.userAuth === 'client' || this.state.userAuth === 'creator') {
      this.getData()
      this.getPanier()
      console.log('<UserGestion> isAuth : ' + this.state.userAuth)
    } else {
      this.setState({ userAuth: 'basic' })
      console.log('<UserGestion> isAuth : ' + this.state.userAuth)
      this.props.history.push('/Login')
    }
    this.setState({ isLoading: false })
  }

  getSession = async () => {
    let userAuth = await ServerAPI('/users/level', 'get' )
    this.setState({ userAuth: userAuth })
  }

  getData = async () => {
    const computer =  await ServerAPI('/computers/', 'get' )
    var mydata = JSON.parse(computer);
    this.setState({ computers: mydata })
  }

  getPanier = async () => {
    let panier = JSON.parse(await ServerAPI('/users/panier/', 'get' ))
    this.setState({ panier: panier })
  }


  removePanierElement = async key => {
    await ServerAPI('/users/panier/delete', 'POST' , { id : key } )
    this.getPanier()
  }

  requireImage = chemin => {
    try {
      return require(`../img/${chemin}`)
    } catch (err) {
      return require(`../img/default.jpg`)
    }
  }

  handleChange = (e, id) => {

  }

  handleChangeCountRemove = async (id) => {
    await ServerAPI('/users/panier/deleteOne', 'POST' , { id  } )
    this.getPanier()
  }

  handleChangeCountAdd = async (id) => {
    await ServerAPI('/users/panier/add', 'POST' , { id  } )
    this.getPanier()
  }

  handleCheckorder = async (total) => {
    await ServerAPI('/users/orders/add', 'POST' , { order : [...this.state.panier] , total  } )
    this.getPanier()
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

    if (this.state.isLoading === false && ((userAuth === 'manager') || (userAuth === 'client') || (userAuth === 'creator') )) {



      let cards = []


      Object.keys(computers)
        .forEach(key => {
          if (panier.includes(computers[key]._id)) {
            computers[key].count = this.getRecurance(panier, computers[key]._id)
            cards.push(computers[key])
          }
        })

      let cards_ = Object.keys(cards)
        .map(key => <Lignepanier key={key} car={cards[key]} handleChange={this.handleChange} requireImage={this.requireImage} removePanierElement={this.removePanierElement}
          handleChangeCountRemove={this.handleChangeCountRemove} handleChangeCountAdd={this.handleChangeCountAdd} />)

      let total = 0
      Object.keys(cards).forEach(key => {
        total = total + parseInt(cards[key].price * cards[key].count)
      })

      const totalCount = <Total total={total} handleCheckorder={this.handleCheckorder} history={this.goToCatalogue}></Total>


      return (
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
      );
    } else {
      return (
        <div className='text-center'>
          <br /><br /><br /><br /><CircularProgress disableShrink />
        </div>
      )
    }
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
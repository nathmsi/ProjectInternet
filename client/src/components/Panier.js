import React, { Component } from "react";
import '../styles/Catalogue.css'
import CircularProgress from '@material-ui/core/CircularProgress';
import { dbComputersList, dbDeletePanier  , dbDeleteOnePanier , dbAddPanier , dbAddOrder} from "../api/db"




class Panier extends Component {



  state = {
    computers: {},
    userAuth: 'basic',
    panier: [],
    isLoading: true
  }

  async componentDidMount() {
    await this.getSession()
    if (this.state.userAuth === 'manager' || this.state.userAuth === 'client') {
      this.getData()
      this.getPanier() 
      this.setState({ isLoading: false })
      console.log('<UserGestion> isAuth : ' + this.state.userAuth)
    }  else {
      this.setState({ userAuth: 'basic' })
      console.log('<UserGestion> isAuth : ' + this.state.userAuth)
      this.props.history.push('/Login')
    }
  }

  getSession = async () => {
    let userAuth = await fetch('/users/level', { method: 'get' })
      .then(res => res.text())
    this.setState({ userAuth: userAuth })
  }

  getData = async () => {
    const computer = await dbComputersList()
    var mydata = JSON.parse(computer);
    this.setState({ computers: mydata })
  }

  getPanier = async () => {
    let panier = []
    await fetch('/users/panier/', { method: 'get' }).then(res => res.text()).then(res => panier = JSON.parse(res)).catch(err => err)
    this.setState({ panier: panier })
  }


  removePanierElement = async key => {
    await dbDeletePanier(key)
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

  handleChangeCountRemove = async (id) =>{
    await dbDeleteOnePanier(id)
    this.getPanier()
  }

  handleChangeCountAdd = async (id) =>{
    await dbAddPanier(id)
    this.getPanier()
  }

  handleCheckorder  = async (total) =>{
    await dbAddOrder([...this.state.panier] ,total)
    this.getPanier()
  }


  getRecurance = (list , value) => {
    var count = (input, arr) => arr.filter(x => x === input).length;
    return count(value, list)
  }

  goToCatalogue = () =>{
    this.props.history.push('/Catalogue')
  }




  render() {
    const { computers, panier , userAuth } = this.state

    if (this.state.isLoading === false && ((userAuth === 'manager') ||(userAuth === 'client') )  ){


      
      let cards = []


      Object.keys(computers)
        .forEach(key => {
          if(panier.includes(computers[key]._id)){
              computers[key].count = this.getRecurance(panier,computers[key]._id)
              cards.push(computers[key])
          }
        })

      let cards_ = Object.keys(cards)
        .map(key => <Lignepanier key={key} car={cards[key]} handleChange={this.handleChange} requireImage={this.requireImage} removePanierElement={this.removePanierElement}
                                 handleChangeCountRemove={this.handleChangeCountRemove} handleChangeCountAdd={this.handleChangeCountAdd} />)

      let total = 0
      Object.keys(cards).forEach(key => {
        total = total + parseInt(cards[key].price * cards[key].count )
      })

      const totalCount = <Total total={total}handleCheckorder={this.handleCheckorder} history={this.goToCatalogue}></Total>


      return (
        <div className='container border'>
        <table className="table table-bordred table-striped">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Price</th>
              <th>Count</th>
              <th >Subtotal</th>
              <th >Delete</th>
            </tr>
          </thead>
          <tbody>
            {cards_}
            {totalCount}
          </tbody>
        </table><br /><br /><br /><br />
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




const Lignepanier = ({ car, removePanierElement, requireImage, handleChangeCountAdd ,handleChangeCountRemove  }) => {

  return (
    <tr>
      <td align="left">
        <img src={requireImage(car.image)} alt={car.name} width="193" height="130" />
      </td>
      <td align="center"> {car.name} </td>
      <td align="center"> {car.price } $ </td>
      <td align=""> 
          <button type="button" onClick={() => handleChangeCountRemove(car._id)} className="btn btn-secondary btn-outline-light btn-sm">-</button>
          &nbsp;{car.count} &nbsp;
          <button type="button" onClick={() => handleChangeCountAdd(car._id)} className="btn btn-secondary btn-outline-light btn-sm">+</button> 
      </td>
      <td align="center"> {car.price * car.count} $ </td>
      <td align="center" className="id_dir">
        <button className="btn btn-danger " onClick={() => removePanierElement(car._id)} data-title="Delete">Delete</button>
      </td>
    </tr>
  )
}

const Total = ({ total  , handleCheckorder , history}) => {
  return (
    <tr>
							<td><button className="btn btn-warning " onClick={history}> Continue Shopping<i className="fa fa-angle-right"></i></button></td>
							<td  className="hidden-xs"></td>
              <td  className="hidden-xs"></td>
              <td  className="hidden-xs"></td>
							<td className="hidden-xs text-center"><strong>{total} $</strong></td>
							<td><button   onClick={() => handleCheckorder(total)}  className="btn btn-success btn-block">Checkout <i className="fa fa-angle-right"></i></button></td>
						</tr>
    )
}




export default Panier;
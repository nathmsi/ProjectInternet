import React, { Component } from "react";
import '../styles/Catalogue.css'
import Card from './screen/Card'
import Select from 'react-select';
import LoadingOverlay from 'react-loading-overlay';
import Modal from './screen/modalDialog'

import { ServerAPI } from "../api/db"


class Catalogue extends Component {

  state = {
    computers: {},
    computersSelected: {},
    userAuth: 'basic',
    modal: false,
    selectedOption_1: { value: "All", label: "All" },
    selectedOption_2: { value: "All", label: "All" },
    selectedOption_3: { value: "All", label: "All" },
    brands: [],
    memorySizes: [],
    screenSize: [],
    isActive: true,
    show: false,
    idSelect: ''
  }

  async componentWillMount() {
    try {
      document.title = 'Catalogue / Car Sale'
      const userAuth = await ServerAPI('/users/level', 'get')
      const computers = JSON.parse(await ServerAPI('/computers/', 'get'))
      this.setState({ computers: computers, computersSelected: computers, userAuth })
      this.setBrand(this.state.computers)
      this.setMemorySize(this.state.computers)
      this.setScreenSize(this.state.computers)
      console.log('<Catalogue> isAuth ')
      this.setState({ isActive: false })
    } catch (err) {
      console.log('<Catalogue> err : ' + err)
      this.setState({ isActive: false })
      this.props.history.push('/login')
    }
  }

  componentWillUnmount = () => {

  }




  setBrand = (computers) => {
    let listBrand = ['All', ...new Set(computers.map(element => element.brand))]
    const brands = listBrand.map(element => ({ value: element, label: element }))
    this.setState({ brands: brands })
  }

  setMemorySize = (computers) => {
    let listmemorySize = ['All', ...new Set(computers.map(element => element.MemorySize))];
    const memorySizes = listmemorySize.map(element => ({ value: element, label: element }))
    this.setState({ memorySizes: memorySizes })
  }

  setScreenSize = (computers) => {
    let listScreenSize = ['All', ...new Set(computers.map(element => element.sizeScreen))];
    const listscreenSize = listScreenSize.map(element => ({ value: element, label: element }))
    this.setState({ screenSize: listscreenSize })
  }

  addPanier = async (id, goToPanier, inStock) => {
    const { userAuth } = this.state
    if (userAuth === 'manager' || userAuth === 'creator' || userAuth === 'client') {
      if (inStock === true) {
        this.setState({
          show: true,
          idSelect: id,
          goToPanier
        })
      } else {
        alert('this object not available in stock')
      }
    } else {
      this.props.history.push('/login')
    }
  }

  handleChangeBrand = async (selectedOption_1) => {
    const { selectedOption_2, selectedOption_3 } = this.state
    this.setState({ selectedOption_1 })
    let computers = []
    this.state.computers.forEach(element => {
      if ((selectedOption_1.label === 'All' || element.brand === selectedOption_1.label) &&
        (selectedOption_2.label === 'All' || element.MemorySize === selectedOption_2.label) &&
        (selectedOption_3.label === 'All' || element.sizeScreen === selectedOption_3.label))
        computers.push(element)
    })
    this.setBrand(this.state.computers)
    this.setMemorySize(computers)
    this.setScreenSize(computers)
    this.setState({ computersSelected: computers })
  }

  handleChangememorySizes = async (selectedOption_2) => {
    const { selectedOption_1, selectedOption_3 } = this.state
    this.setState({ selectedOption_2 });
    let computers = []
    this.state.computers.forEach(element => {
      if ((selectedOption_2.label === 'All' || element.MemorySize === selectedOption_2.label) &&
        (selectedOption_1.label === 'All' || element.brand === selectedOption_1.label) &&
        (selectedOption_3.label === 'All' || element.sizeScreen === selectedOption_3.label))
        computers.push(element)
    })
    this.setBrand(this.state.computers)
    this.setScreenSize(computers)
    this.setState({ computersSelected: computers })
  }

  handleChangescreenSize = async (selectedOption_3) => {
    const { selectedOption_1, selectedOption_2 } = this.state
    this.setState({ selectedOption_3 });
    let computers = []
    this.state.computers.forEach(element => {
      if ((selectedOption_3.label === 'All' || element.sizeScreen === selectedOption_3.label) &&
        (selectedOption_1.label === 'All' || element.brand === selectedOption_1.label) &&
        (selectedOption_2.label === 'All' || element.MemorySize === selectedOption_2.label))
        computers.push(element)
    })
    this.setBrand(this.state.computers)
    this.setMemorySize(computers)
    this.setState({ computersSelected: computers })
  }

  handleClose = () => {
    this.setState({ show: false })
  }

  handlesubmitModal = async () => {
    this.setState({ isActive: true })
    await ServerAPI('/users/panier/add', 'POST', { id: this.state.idSelect })
    if (this.state.goToPanier) {
      this.props.history.push('/panier')
    }
    else {
      this.setState({ isActive: false, show: false })
    }
  }


  render() {


    const { computersSelected, selectedOption_1, selectedOption_2, selectedOption_3, brands, memorySizes, screenSize } = this.state
    let computers = <></>

    computers = Object.keys(computersSelected)
      .map(key => <Card key={key} details={computersSelected[key]} addPanier={this.addPanier} ></Card>)

    return (
      <LoadingOverlay
        active={this.state.isActive}
        spinner
        text={<h2 className='text-dark'>Please wait a few time ...</h2>}
      >
        {
          this.state.isActive === false &&
          (
            <>
            <div className="container">
              <hr className="style1" />


              <div className="row">
                <div className="col-2">
                  <h4 className="input-group-addon">Brand </h4>
                </div>
                <div className="col-10">
                  <Select
                    value={selectedOption_1}
                    onChange={this.handleChangeBrand}
                    options={brands}
                  />
                </div>
              </div><br />
              <div className="row">
                <div className="col-2">
                  <h4 className="input-group-addon">Memory Size </h4>
                </div>
                <div className="col-10">
                  <Select
                    value={selectedOption_2}
                    onChange={this.handleChangememorySizes}
                    options={memorySizes}
                  />
                </div>
              </div><br />
              <div className="row">
                <div className="col-2">
                  <h4 className="input-group-addon">Screen Size </h4>
                </div>
                <div className="col-10">
                  <Select
                    value={selectedOption_3}
                    onChange={this.handleChangescreenSize}
                    options={screenSize}
                  />
                </div>

              </div>
            </div>

            <hr className="style1" />
            <div className='cards computerList'>
              {computers}
            </div>
            < Modal show={this.state.show} handleClose={this.handleClose} handleSubmit={this.handlesubmitModal} title={"Confirmation add to shopping cart"} Body={""} />
            </>
          )
        }
      </LoadingOverlay>
    );


  }


}




export default Catalogue;
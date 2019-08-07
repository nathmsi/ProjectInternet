import React, { Component } from "react";
import '../styles/Catalogue.css'
import LoadingOverlay from 'react-loading-overlay';
import AddComputer from './AddComputer'
import UpdateComputer from "./UpdateComputer";

import { ServerAPI } from "../api/db"

class CatalogueGestion extends Component {

  constructor(props) {
    super(props);
    this._isMounted = false;
  }

  state = {
    computers: {},
    userAuth: 'basic',
    isActive: true
  }

  async componentDidMount() {
    try {
      this._isMounted = true;
      let userAuth = await ServerAPI('/users/level', 'get')
      if (userAuth === 'manager' || userAuth === 'creator') {
        let myData = await this.getData()
        this._isMounted && this.setState({ isLoading: false, computers: myData, userAuth: userAuth })
        console.log('<CatalogueGestion> isAuth : ' + userAuth)
      }
      else {
        this._isMounted && this.setState({ userAuth: 'basic' })
        console.log('<CatalogueGestion> isAuth : ' + userAuth)
        this.props.history.push('/Login')
      }
      this.setState({ isActive: false })

    } catch (err) {
      this.setState({ isActive: false })
      this.props.history.push('/Login')
      console.log('<Catalogue> err : ' + err)
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  getData = async () => {
    const computers = await ServerAPI('/computers/', 'get')
    return JSON.parse(computers);
  }

  AddComputer = async computer => {
    this.setState({ isActive: true })
    await ServerAPI('/computers/add', 'POST', {
      name: computer.name,
      image: computer.image,
      price: computer.price,
      brand: computer.brand,
      cpu: computer.cpu,
      sizeScreen: computer.sizeScreen,
      OperatingSystem: computer.OperatingSystem,
      capacity: computer.capacity,
      MemorySize: computer.MemorySize,
      count : computer.count
    })

    let myData = await this.getData()
    this.setState({ isActive: false, computers: myData })
  }

  removeComputers = async key => {
    this.setState({ isActive: true })
    await ServerAPI('/computers/delete', 'POST', { id: key })
    let myData = await this.getData()
    this.setState({ isActive: false, computers: myData })
  }

  updateComputers = async computer => {
    this.setState({ isActive: true })
    await ServerAPI('/computers/update', 'POST', {
      id: computer.id,
      name: computer.name,
      image: computer.image,
      price: computer.price,
      brand: computer.brand,
      cpu: computer.cpu,
      sizeScreen: computer.sizeScreen,
      OperatingSystem: computer.OperatingSystem,
      capacity: computer.capacity,
      MemorySize: computer.MemorySize
    })
    let myData = await this.getData()
    this.setState({ isActive: false, computers: myData })
  }

  handleChangeCountRemove = async (id) => {
    try {
      this.setState({ isActive: true })
      await ServerAPI('/computers/stock/delete', 'POST', { id })
      let myData = await this.getData()
      this.setState({ isActive: false, computers: myData })
    } catch (err) {
      console.log(err)
      this.setState({ isActive: false })
    }
  }


  handleChangeCountAdd = async (id) => {
    try {
      this.setState({ isActive: true })
      await ServerAPI('/computers/stock/add', 'POST', { id })
      let myData = await this.getData()
      this.setState({ isActive: false, computers: myData })
    } catch (err) {
      console.log(err)
      this.setState({ isActive: false })
    }
  }




  render() {
    const { userAuth, computers } = this.state
    let updateComputers = <></>
    let addComputers = <></>

    if (userAuth === 'manager' || userAuth === 'creator') {
      updateComputers = Object.keys(computers)
        .map(key => <UpdateComputer key={key} id={key} removeComputers={this.removeComputers} updateComputers={this.updateComputers}
          handleChangeCountRemove={this.handleChangeCountRemove} handleChangeCountAdd={this.handleChangeCountAdd} computer={computers[key]} />)

      addComputers = <AddComputer AddComputer={this.AddComputer} />
    }

    return (
      <LoadingOverlay
        active={this.state.isActive}
        spinner
        text='Loading your content...'
      >

        <div className='cards computerUpdateList'>
          {addComputers}
          {updateComputers}
        </div>

      </LoadingOverlay>
    );


  }


}




export default CatalogueGestion;
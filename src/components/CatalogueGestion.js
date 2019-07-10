import React, { Component } from "react";
import '../styles/Catalogue.css'
import CircularProgress from '@material-ui/core/CircularProgress';
import LoadingOverlay from 'react-loading-overlay';
import AddComputer from './AddComputer'
import UpdateComputer from "./UpdateComputer";

import { dbComputersList, dbAddComputer, dbDeletecomputer, dbUpdateComputer } from "../api/db"


class CatalogueGestion extends Component {

  constructor(props) {
    super(props);
    this._isMounted = false;
  }

  state = {
    computers: {},
    userAuth: 'basic',
    modal: false,
    isLoading: true,
    isActive: false
  }

  async componentDidMount() {
    try {
      this._isMounted = true;
      let userAuth = await fetch('/users/level', { method: 'get' })
        .then(res => res.text())

      if (userAuth === 'manager') {
        let myData = await this.getData()
        this._isMounted && this.setState({ isLoading: false, computers: myData, userAuth: userAuth })
        console.log('<CatalogueGestion> isAuth : ' + userAuth)
      }
      else {
        this._isMounted && this.setState({ userAuth: 'basic' })
        console.log('<CatalogueGestion> isAuth : ' + userAuth)
        this.props.history.push('/Login')
      }


    } catch (err) {
      console.log('<Catalogue> err : ' + err)
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  getData = async () => {
    const computers = await dbComputersList()
    return JSON.parse(computers);
  }

  AddComputer = async computer => {
    this.setState({ isActive: true })
    this.handleOpenModal()
    await dbAddComputer(computer.name, computer.image, computer.price,
      computer.brand, computer.cpu, computer.sizeScreen, computer.OperatingSystem,
      computer.capacity, computer.MemorySize)
    let myData = await this.getData()
    this.setState({ isActive: false, computers: myData })
  }

  removeComputers = async key => {
    this.setState({ isActive: true })
    await dbDeletecomputer(key)
    let myData = await this.getData()
    this.setState({ isActive: false, computers: myData })
  }

  updateComputers = async computer => {
    this.setState({ isActive: true })
    await dbUpdateComputer(computer.id, computer.name, computer.image, computer.price,
      computer.brand, computer.cpu, computer.sizeScreen, computer.OperatingSystem,
      computer.capacity, computer.MemorySize)
    let myData = await this.getData()
    this.setState({ isActive: false, computers: myData })
  }

  handleCloseModal = () => {
    this.setState({ modal: false });
  };
  handleOpenModal = () => {
    this.setState({ modal: true });
  };



  render() {
    const { userAuth, computers } = this.state
    let updateComputers = <></>
    let addComputers = <></>

    if (userAuth === 'manager') {

      updateComputers = Object.keys(computers)
        .map(key => <UpdateComputer key={key} id={key} removeComputers={this.removeComputers} updateComputers={this.updateComputers} computer={computers[key]} />)

      addComputers = <AddComputer AddComputer={this.AddComputer} />

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
    else {
      return (
        <div className='text-center'>
          <p>Wait ...</p>
          <CircularProgress disableShrink />
        </div>
      )
    }
  }


}




export default CatalogueGestion;
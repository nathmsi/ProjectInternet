import React, { Component } from "react";
import CircularProgress from '@material-ui/core/CircularProgress';
import '../styles/Catalogue.css'

import Select from 'react-select';
import LoadingOverlay from 'react-loading-overlay';


import {  ServerAPI} from "../api/db"

class OrderGestion extends Component {

    state = {
        users: [],
        userAuth: 'basic',
        isLoading: true,
        selectedOption: { value: "All", label: "All" },
        orders: [],
        order: [],
        isActive: false
    }



    async componentDidMount() {
        let userAuth = await ServerAPI('/users/level', 'get' )

        this.setState({ userAuth: userAuth })

        if (userAuth === 'manager' || userAuth === 'creator') {
            this.getData()
            this.setState({ isLoading: false })
            console.log('<UserGestion> isAuth : ' + userAuth)
        }
        else {
            this.setState({ userAuth: 'basic' })
            console.log('<UserGestion> isAuth : ' + userAuth)
            this.props.history.push('/Login')
        }

    }

    getData = async () => {
        const users = await ServerAPI('/users/', 'get' )
        var mydata = JSON.parse(users)
        this.setState({ users: mydata })
        this.setOrders(mydata)
    }


    updateUser = async (key, level) => {
        this.setState({ isActive: true })
        await ServerAPI('/users/level', 'POST' ,{
            'id': key,
            'level': level
          })
        this.getData()
        this.setState({ isActive: false })
    }

    setOrders = (users) => {
        let listOrders = ['All', ...new Set(users.map(element => { return { orders: element.orders, username: element.username } }))]
        const brands = listOrders.map(element => ({ value: element.orders, label: element.username }))
        this.setState({ orders: brands })
    }

    handleChangeorder = async (selectedOption) => {

        this.setState({ selectedOption });

        this.setState({ order: selectedOption.value })

    }

    handleDelete = async (idnex) => {
        this.setState({ isActive: true })
        const { selectedOption, order, users } = this.state
        order.splice(idnex, 1);

        let id = 0
        users.forEach(element => {
            if (element.username === selectedOption.label)
                id = element._id
        });

        await ServerAPI('/users/orders/update', 'POST' ,
            { id, orders: order }
          )


        await this.getData()

        this.setState({ isActive: false })

    }



    render() {


        const { isLoading, userAuth } = this.state

        if (isLoading === false && ( userAuth === 'manager' || userAuth === 'creator')) {

            const { orders, order, selectedOption } = this.state


            let cards_ = <></>

            try {
                cards_ = Object.keys(order)
                    .map(key => <Lignepanier key={key} id={key} order={order[key]} handleDelete={this.handleDelete} />)
            }
            catch (err) {
                console.log(err)
            }




            return (
                <LoadingOverlay
                    active={this.state.isActive}
                    spinner
                    text='Loading your content...'
                >
                    <div className="row">
                        <div className="col-2">
                            <h4 className="input-group-addon text-center"> username </h4>
                        </div>
                        <div className="col-10">
                            <Select
                                value={selectedOption}
                                onChange={this.handleChangeorder}
                                options={orders}
                            />
                        </div>
                    </div><br />
                    <div className='panierScrool bg-light'>
                        <table className="table table-bordred table-striped  bg-light">
                            <thead>
                                <tr>
                                    <th align="center">number</th>
                                    <th align="center">count</th>
                                    <th align="center">total</th>
                                    <th align="center">Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cards_}
                            </tbody>
                        </table>

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

const Lignepanier = ({ order, id, handleDelete }) => {


    return (
        <tr>

            <td align="left"> {id} </td>
            <td align="left"> {order.order.length} </td>
            <td align="left"> {order.total} </td>
            <td align="left" className="id_dir">
                <button className="btn btn-danger " onClick={() => handleDelete(id)} data-title="Delete">Delete</button>
            </td>

        </tr>
    )
}



export default OrderGestion;
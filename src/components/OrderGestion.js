import React, { Component } from "react";
import '../styles/Catalogue.css'

import Select from 'react-select';
import LoadingOverlay from 'react-loading-overlay';


import { ServerAPI } from "../api/db"

class OrderGestion extends Component {

    state = {
        users: [],
        userAuth: 'basic',
        selectedOption: { value: "All", label: "All" },
        selectedDay: { value: "All", label: "All" },
        selectedMonth: { value: "All", label: "All" },
        selectedYears: { value: "All", label: "All" },
        days: [],
        months: [],
        years: [],
        orders: [],
        order: [],
        allOrders: [],
        ordersSelected: [],
        isActive: true
    }



    async componentDidMount() {
        try {
            document.title = 'OrderGestion / Computer Sale'
            let account = JSON.parse(await ServerAPI('/users/account/', 'get'))

            this.setState({ userAuth: account.level, username: account.username })

            if (account.level === 'manager' || account.level === 'creator') {
                await this.getData()
                this.setState({ isActive: false })
                console.log('<OrderGestion> isAuth : ' + account.level)
            }
            else {
                this.setState({ userAuth: 'basic' })
                console.log('<OrderGestion> isAuth : ' + account.level)
                this.setState({ isActive: false })
                this.props.history.push('/Login')
            }
        } catch (err) {
            console.log(err)
            this.setState({ isActive: false })
            this.props.history.push('/Login')
        }

    }

    getData = async () => {
        const users = await ServerAPI('/users/', 'get')
        var mydata = JSON.parse(users)
        this.setState({ users: mydata })
        this.setOrders(mydata)
        this.setAllOrders(mydata)
        this.setDate()
    }



    setOrders = (users) => {
        let listOrders = [...new Set(users.map(element => { return { orders: element.orders, username: element.username } }))]
        const brands = listOrders.map(element => ({ value: element.orders, label: element.username }))
        let myOrder = {}
        listOrders.forEach(element => {
            if (element.username === this.state.username) myOrder = { value: element.orders, label: element.username }
        });
        if (myOrder !== []) {
            this.handleChangeorder(myOrder)
        }
        this.setState({ orders: brands })
    }

    setAllOrders = (users) => {
        let orders = []
        users.forEach(user => {
            let order = user.orders
            order.forEach(element => {
                element.username = user.username
            });
            orders = orders.concat(order)
        })
        this.setState({ allOrders: orders })
    }

    setDate = () => {
        var days = [];
        days.push('All');
        for (var i = 1; i <= 31; i++) {
            days.push(i);
        }
        var month = [];
        month.push('All');
        for (i = 1; i <= 12; i++) {
            month.push(i);
        }
        var years = [];
        years.push('All');
        for (i = 2000; i <= 2040; i++) {
            years.push(i);
        }

        const days_ = days.map(element => ({ value: element, label: element }))
        const month_ = month.map(element => ({ value: element, label: element }))
        const years_ = years.map(element => ({ value: element, label: element }))

        this.setState({ days: days_, months: month_, years: years_ })
        this.handleChangeDay({ value: 'All', label: 'All' })
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

        await ServerAPI('/users/orders/update', 'POST',
            { id, orders: order }
        )

        await this.getData()

        this.setState({ isActive: false })

    }

    handleChangeDay = (selectedDay) => {
        this.setState({ selectedDay });
        const { allOrders, selectedMonth, selectedYears } = this.state
        let newOrders = []
        allOrders.forEach(order => {
            if (order !== undefined) {
                let date = order.date
                if ((date.day === selectedDay.label || selectedDay.label === 'All') &&
                    (date.month === selectedMonth.label || selectedMonth.label === 'All') &&
                    (date.years === selectedYears.label || selectedYears.label === 'All')) {
                    newOrders.push(order)
                }
            }
        })
        this.setState({ ordersSelected: newOrders })
    }

    handleChangeMonth = (selectedMonth) => {
        this.setState({ selectedMonth });
        const { allOrders, selectedDay, selectedYears } = this.state
        let newOrders = []
        allOrders.forEach(order => {
            if (order.date !== undefined) {
                let date = order.date
                if ((date.day === selectedDay.label || selectedDay.label === 'All') &&
                    (date.month === selectedMonth.label || selectedMonth.label === 'All') &&
                    (date.years === selectedYears.label || selectedYears.label === 'All')) {
                    newOrders.push(order)
                }
            }
        })

        this.setState({ ordersSelected: newOrders })
    }

    handleChangeYears = (selectedYears) => {
        this.setState({ selectedYears });
        const { allOrders, selectedMonth, selectedDay } = this.state
        let newOrders = []
        allOrders.forEach(order => {
            if (order.date !== undefined) {
                let date = order.date
                if ((date.day === selectedDay.label || selectedDay.label === 'All') &&
                    (date.month === selectedMonth.label || selectedMonth.label === 'All') &&
                    (date.years === selectedYears.label || selectedYears.label === 'All')) {
                    newOrders.push(order)
                }
            }
        })

        this.setState({ ordersSelected: newOrders })
    }



    render() {


        let cards_ = <></>
        let orderSelected = <></>
        let totalByUesername = 0
        let totalByOrdersSelected = 0
        const { orders, order, selectedOption, selectedDay, selectedMonth, selectedYears, days, months, years, ordersSelected, userAuth } = this.state

        if ((userAuth === 'manager' || userAuth === 'creator')) {

            order.forEach(element => {
                totalByUesername += element.total
            });

            ordersSelected.forEach(element => {
                totalByOrdersSelected += element.total
            });
            try {
                cards_ = Object.keys(order)
                    .map(key => <Lignepanier key={key} id={key} order={order[key]} handleDelete={this.handleDelete} />)
                orderSelected = Object.keys(ordersSelected)
                    .map(key => <Lignepanier key={key} id={key} order={ordersSelected[key]} handleDelete={this.handleDelete} />)
            }
            catch (err) {
                console.log(err)
            }

        }



        return (
            <LoadingOverlay
                active={this.state.isActive}
                spinner
                text={<h2 className='text-dark'>Please wait a few time ...</h2>}
            >
                
                            <div className="row">
                                <div className="col-2">
                                    <h4 className="input-group-addon text-center bg-secondary text-white"> username </h4>
                                </div>
                                <div className="col-10">
                                    <Select
                                        value={selectedOption}
                                        onChange={this.handleChangeorder}
                                        options={orders}
                                    />
                                </div>
                            </div><br />
                            <div className='OrderScrool bg-light'>
                                <table className="table table-bordred table-striped  bg-light">
                                    <thead>
                                        <tr>
                                            <th align="center">username</th>
                                            <th align="center">count</th>
                                            <th align="center">date</th>
                                            <th align="center">total</th>
                                            <th align="center">Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cards_}
                                        <tr>
                                            <td align="left">  </td>
                                            <td align="left">  </td>
                                            <td align="left">  </td>
                                            <td align="left" className="id_dir">
                                                TOTAL : {totalByUesername}
                                            </td>
                                            <td align="left">  </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <br />
                            <div className="row">
                                <div className="col-2">
                                    <h4 className="input-group-addon text-center bg-secondary text-white"> Day </h4>
                                </div>
                                <div className="col-2">
                                    <Select
                                        value={selectedDay}
                                        onChange={this.handleChangeDay}
                                        options={days}
                                    />
                                </div>
                                <div className="col-2">
                                    <h4 className="input-group-addon text-center bg-secondary text-white"> Month </h4>
                                </div>
                                <div className="col-2">
                                    <Select
                                        value={selectedMonth}
                                        onChange={this.handleChangeMonth}
                                        options={months}
                                    />
                                </div>
                                <div className="col-2">
                                    <h4 className="input-group-addon text-center bg-secondary text-white"> Years </h4>
                                </div>
                                <div className="col-2">
                                    <Select
                                        value={selectedYears}
                                        onChange={this.handleChangeYears}
                                        options={years}
                                    />
                                </div>
                            </div>
                            <br />
                            <div className='OrderScrool bg-light'>
                                <table className="table table-bordred table-striped  bg-light">
                                    <thead>
                                        <tr>
                                            <th align="center">username</th>
                                            <th align="center">count</th>
                                            <th align="center">date</th>
                                            <th align="center">total</th>
                                            <th align="center">Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orderSelected}
                                        <tr>
                                            <td align="left">  </td>
                                            <td align="left">  </td>
                                            <td align="left">  </td>
                                            <td align="left" className="id_dir">
                                                TOTAL : {totalByOrdersSelected}
                                            </td>
                                            <td align="left">  </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
            </LoadingOverlay>
        );



    }


}

const Lignepanier = ({ order, id, handleDelete }) => {

    let date = ''
    date = order.date.day.toString() + '/' + order.date.month.toString() + '/' + order.date.years.toString() + ' '
        + order.date.hours.toString() + ':' + order.date.minutes.toString()
    return (
        <tr>
            <td align="left"> {order.username} </td>
            <td align="left"> {order.order.length} </td>
            <td align="left">  {date} </td>
            <td align="left"> {order.total} </td>
            <td align="left" className="id_dir">
                <button className="btn btn-danger " onClick={() => handleDelete(id)} data-title="Delete">Delete</button>
            </td>
        </tr>
    )
}




export default OrderGestion;
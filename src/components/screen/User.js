import React from 'react'

const User = ({ details, deleteUser, updateUserLevel }) => {


    let panier = <></>
    panier = Object.keys(details.panier)
        .map(key => <Panier key={key} id={details.panier[key]} />)

    let orders = <></>
    orders = Object.keys(details.orders)
        .map(key => <Order key={key} total={details.orders[key].total} index={key} id={details.orders[key].order} />)


    return (

        <div className='card'>
            <div className='recette'>
                <h2>username : <strong>{details.username}</strong></h2>
                <ul className='liste-agredients'>
                    id => <strong>{details._id}</strong> <br />
                    level => <strong>{details.level}</strong> <br />
                    phone => <strong>{details.phone}</strong> <br />
                    address => <strong>{details.address}</strong> <br />
                    email => <strong>{details.email}</strong> <br />
                    panier => <br />
                    <div className="AccountOrderScrool" >
                        {panier}
                    </div>
                    orders =>  <br />
                    <div className="AccountOrderScrool" >
                        {orders}
                    </div>
                </ul>
            </div>
            <div className='container'>
                <div className='col-sm-4'>
                    <button className='btn btn-danger btn-outline-dark' onClick={() => deleteUser(details._id)}
                    >Delete</button>
                </div>
                <div className='col-sm-4'>
                    <button className='btn btn-warning btn-outline-dark' onClick={() => updateUserLevel(details._id, 'manager')}
                    >Set Manager</button>
                </div>
                <div className='col-sm-4'>
                    <button className='btn btn-success btn-outline-dark' onClick={() => updateUserLevel(details._id, 'client')}
                    >Set Client</button>
                </div>
            </div>
        </div>
    )
}

const Panier = ({ id }) => {

    return (
        <div className='container border '> Id computer : <strong> {id} </strong><br /></div>
    )
}

const Order = ({ total, index }) => {
    return (
        <div className='container border '>
            Order {(parseInt(index) + 1)} <br />
            <strong> Total =>   {total} $ </strong>
        </div>
    )
}

export default User
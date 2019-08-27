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
                <br />
                <h2 className='h1-title' >{details.username}</h2>  <br />
                <ul className='liste-agredients'>
                    id : <strong>{details._id}</strong> <br />
                    level : <strong>{details.level}</strong> <br />
                    phone : <strong>{details.phone}</strong> <br />
                    address : <strong>{details.address}</strong> <br />
                    email : <strong>{details.email}</strong> <br />
                    panier : <br />
                    <div className="OrderScroolUser" >
                        {panier}
                    </div>
                    orders :  <br />
                    <div className="OrderScroolUser" >
                        {orders}
                    </div>
                </ul>
                <button className='btn btn-warning btn-lg' onClick={() => updateUserLevel(details._id, 'manager')} > Set Manager </button>
                &nbsp;&nbsp;&nbsp;
                <button className='btn btn-info btn-lg' onClick={() => updateUserLevel(details._id, 'client')} > Set Client </button>
                &nbsp;&nbsp;&nbsp;
                <button className='btn btn-danger btn-lg' onClick={() => deleteUser(details._id)}> Delete User </button>
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
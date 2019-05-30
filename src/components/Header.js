import React, { Component } from 'react'
import {
    NavLink
} from "react-router-dom";

class Header extends Component {


    requireImage = chemin => {
        try {
            return require(`../img/${chemin}`)
        } catch (err) {
            return require(`../img/default.jpg`)
        }
    }

    render() {

        const { userAuth, userName, handleLogout } = this.props
        let header = <></>
        let btn = <></>
        let panier = <></>
        let account = <></>

        if (userAuth === 'basic') {
            header = <>
                <li className="nav-item"><NavLink className="nav-link text-primary font-weight-bold" to="/About">About</NavLink></li>
                <li className="nav-item"><NavLink  className="nav-link text-primary font-weight-bold" to="/Contact">Contact</NavLink></li>
            </>
            btn = <NavLink to="/Login"> <button type="button" className="btn btn-outline-primary my-2 my-sm-0">login</button> </NavLink>
        } else if (userAuth === 'manager') {
            header = <>
                <li className="nav-item"><NavLink className="nav-link text-primary font-weight-bold" to="/Catalogue">Catalogue</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link text-primary font-weight-bold" to="/CatalogueGestion">CatalogueGestion</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link text-primary font-weight-bold" to="/UserGestion">UserGestion</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link text-primary font-weight-bold" to="/Chat">Chat</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link text-primary font-weight-bold" to="/About">About</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link text-primary font-weight-bold" to="/Contact">Contact</NavLink></li>
            </>
            panier = <NavLink to="/Panier">  <button type="button" className="btn btn-outline-primary my-2 my-sm-0">Shopping cart</button> </NavLink>
            account =  <NavLink to="/Account">  <button type="button" className="btn btn-outline-primary my-2 my-sm-0">Account</button> </NavLink>
            btn = <NavLink to="/Login">  <button type="button" onClick={() => handleLogout()} className="btn btn-outline-primary my-2 my-sm-0">logout</button> </NavLink>
        } else if (userAuth === 'client') {
            header = <>
                <li className="nav-item"><NavLink className="nav-link text-primary font-weight-bold" to="/Catalogue">Catalogue</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link text-primary font-weight-bold" to="/Chat">Chat</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link text-primary font-weight-bold" to="/About">About</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link text-primary font-weight-bold" to="/Contact">Contact</NavLink></li>
            </>
            panier = <NavLink to="/Panier">  <button type="button" className="btn btn-outline-primary my-2 my-sm-0">Shopping cart</button> </NavLink>
            account =  <NavLink to="/Account">  <button type="button" className="btn btn-outline-primary my-2 my-sm-0">Account</button> </NavLink>
            btn = <NavLink to="/Login">  <button type="button" onClick={() => handleLogout()} className="btn btn-outline-primary my-2 my-sm-0">logout</button> </NavLink>
        }


        return (
            <div >
                <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                        <a className="navbar-brand" href="/">
                             <img src={this.requireImage('logo.png')} alt={''} width="50" height="50" /> 
                        </a>
                        <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                            {header} 
                        </ul>
                        <div>welcome <strong className='text-primary'>{userName}</strong></div>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
                        <div>
                        {account}
                        {panier}
                        {btn}
                        </div>
                    </div>
                </nav>
            </div>
        )
    }
}


export default Header
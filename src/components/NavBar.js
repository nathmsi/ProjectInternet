import React, { Component } from 'react'
import {
    NavLink
} from "react-router-dom";


class NavBar extends Component {



    componentDidMount = () =>{
        this.props.getCountPanier()
    }


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
                <li className="nav-item"><NavLink className="nav-link text-white  font-weight-bold" to="/Catalogue">Catalogue</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link text-white  font-weight-bold" to="/About">About</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link text-white font-weight-bold" to="/Contact">Contact</NavLink></li>
            </>
            btn = <NavLink to="/Login" className="text-white"> <img src={this.requireImage('icon/login.png')} title={"login"} alt={'login'} width="40" height="30" />Login</NavLink>
        } else if (userAuth === 'manager') {
            header = <>
                <li className="nav-item"><NavLink className="nav-link text-white  font-weight-bold" to="/Catalogue">Catalogue</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link text-white  font-weight-bold" to="/CatalogueGestion">CatalogueGestion</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link text-white  font-weight-bold" to="/OrderGestion">OrderGestion</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link text-white  font-weight-bold" to="/Blog">Blog</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link text-white  font-weight-bold" to="/About">About</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link text-white  font-weight-bold" to="/Contact">Contact</NavLink></li>
            </>
            panier = <NavLink to="/Panier" className="text-white" >  <img src={this.requireImage('icon/shopping-cart.png')} title={"Shopping cart"} alt={'Shopping cart'} width="40" height="30" />
                <span className="badge badge-primary badge-pill">{this.props.CountPanier}</span>
                Shopping-Cart
                    </NavLink>
            account = <NavLink to="/Account" className="text-white" >  <img src={this.requireImage('icon/account.png')} title={"account"} alt={'account'} width="40" height="30" />  {userName} </NavLink>
            btn = <NavLink to="/Login" className="text-white" onClick={() => handleLogout()} >  <img src={this.requireImage('icon/logout.png')} title={"login"} alt={'login'} width="40" height="30" /> Logout </NavLink>
        } else if (userAuth === 'client') {
            header = <>
                <li className="nav-item"><NavLink className="nav-link text-white  font-weight-bold" to="/Catalogue">Catalogue</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link text-white  font-weight-bold" to="/Blog">Blog</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link text-white  font-weight-bold" to="/About">About</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link text-white  font-weight-bold" to="/Contact">Contact</NavLink></li>
            </>
            panier = <NavLink to="/Panier" className="text-white">  <img src={this.requireImage('icon/shopping-cart.png')} title={"Shopping cart"} alt={'Shopping cart'} width="40" height="30" />
                <span className="badge badge-primary badge-pill">{this.props.CountPanier}</span>
                Shopping-Cart
                    </NavLink>
            account = <NavLink to="/Account" className="text-white">  <img src={this.requireImage('icon/account.png')} title={"account"} alt={'account'} width="40" height="30" /> {userName}  </NavLink>
            btn = <NavLink to="/Login" className="text-white" onClick={() => handleLogout()}  >  <img src={this.requireImage('icon/logout.png')} title={"logout"} alt={'logout'} width="40" height="30" /> Logout </NavLink>
        } else if (userAuth === 'creator') {
            header = <>
                <li className="nav-item"><NavLink className="nav-link text-white  font-weight-bold" to="/Catalogue">Catalogue</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link text-white  font-weight-bold" to="/CatalogueGestion">CatalogueGestion</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link text-white  font-weight-bold" to="/UserGestion">UserGestion</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link text-white  font-weight-bold" to="/OrderGestion">OrderGestion</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link text-white  font-weight-bold" to="/Blog">Blog</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link text-white  font-weight-bold" to="/About">About</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link text-white  font-weight-bold" to="/Contact">Contact</NavLink></li>
            </>
            panier = <NavLink to="/Panier" className="text-white">
                            <img src={this.requireImage('icon/shopping-cart.png')} title={"Shopping cart"} alt={'Shopping cart'} width="40" height="30" />
                            <span className="badge badge-primary badge-pill">{this.props.CountPanier}</span> 
                            Shopping-Cart
                    </NavLink>
            account = <NavLink to="/Account" className="text-white"> <img src={this.requireImage('icon/account.png')} title={"account"} alt={'account'} width="40" height="30" /> {userName} </NavLink>
            btn = <NavLink to="/Login" className="text-white" onClick={() => handleLogout()} >  <img src={this.requireImage('icon/logout.png')} title={"logout"} alt={'logout'} width="40" height="30" /> Logout </NavLink>
        }


        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark ">
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                    <a className="navbar-brand" href="/">
                        <img src={this.requireImage('logo2.png')} alt={'home'} width="50" height="50" />
                    </a>
                    <ul className="navbar-nav mr-auto">
                        {header}
                    </ul>
                    {/* <div><font className='text-white '> Sign-in  </font> &nbsp; <strong className='text-white text-bold'>{userName}</strong></div>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; */}
                    <div>
                        {account}
                        {panier}
                        {btn}
                    </div>
                </div>
            </nav>
        )
    }
}


export default NavBar
import React from "react";


const Home = ({ isLogin, pathTo }) => {
  let ifLogin = isLogin()
  document.title = 'Home / Car Sale'
  return (
    <div className="container">
      <h1 className="text-center" >
        <hr className="style1" />
        <strong>Welcome </strong>
        <hr className="style1" />
      </h1>
      <h3 className="text-center" >
        It's Nice to Meet You!
        </h3>
      <hr className="style1" />
      {
        ifLogin === true ?
          (
            <button
              className="btn btn-outline-dark"
              onClick={() => pathTo('/Catalogue')}
            >
              Catalogue
            </button>
          )
          :
          (
            <button
              className="btn btn-outline-dark"
              onClick={() => pathTo('/Login')}
            >
              Login / Register
            </button>
          )
      }
    </div>
  )
}


export default Home;
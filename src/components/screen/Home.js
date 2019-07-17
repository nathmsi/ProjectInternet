import React from "react";


const Home = ({ handleLogin }) => {
  return (
    <div className="container">
      <h1 className="text-center" >
        <hr className="style1" />
        <strong>Welecome </strong>
        <hr className="style1" />
      </h1>
      <h3 className="text-center" >
        It's Nice to Meet You!
        </h3>
      <hr className="style1" />
      <button
        className="btn btn-outline-dark"
        onClick={handleLogin}
      >
        <div className=" text-white ">
           Login / Register
        </div>
      </button>
    </div>
  )
}


export default Home;
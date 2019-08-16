import React  from 'react'
// import {
//     NavLink
// } from "react-router-dom";


const requireImage = chemin => {
    var parts = chemin.split('\\')
    var lastSegment = parts.pop() || parts.pop()
    try {
      return require(`../../img/uploadsImage/${lastSegment}`)
    } catch (err) {
      return require(`../../img/default.jpg`)
    }
  }


        

const  Card = ({details , addPanier})  =>{
    let count = parseInt(details.count)
    let stock = "Not Available"
    let inStock = false
    if( count >= 1){
       stock = "Available"
       inStock = true
    }

    return (
            <div className='card'>
                <br/>
                <div className='container'>
                    <img src={requireImage(details.image)} alt={details.name} width="400" height="300" />
                </div>
                <div className='recette'>

                    <h3>{details.name}</h3>
                    <ol className='liste-instruction'  >
                        brand  <strong>  {details.brand}</strong> <br />
                        cpu  <strong>    {details.cpu}</strong>  <br />
                        sizeScreen  <strong>    {details.sizeScreen} pouces</strong>  <br />
                        OperatingSystem  <strong>    {details.OperatingSystem} </strong> <br />
                        capacity  <strong>   {details.capacity} go</strong> <br />
                        MemorySize  <strong>    {details.MemorySize} go</strong> <br />
                    </ol>

                    <button className='btn btn-outline-secondary btn-lg' onClick={() => addPanier(details._id,false,inStock)}>+ Add</button>&nbsp;&nbsp;&nbsp;&nbsp;
                    <button className='btn btn-outline-success btn-lg' onClick={() => addPanier(details._id,true,inStock)}> + Go Shopping cart</button>&nbsp;&nbsp;&nbsp; ( {stock} )  &nbsp;
                    <h4 className="font-weight-bold text-right"> {details.price} $  </h4>

                </div>

            </div>
            
        )
}


export default Card
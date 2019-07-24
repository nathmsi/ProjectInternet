import './chat.css'
import React from 'react'

const requireImage = (chemin) =>{
  try {
    var parts = chemin.split('\\')
    var lastSegment = parts.pop() || parts.pop()
    return require(`../../img/uploadsImage/${lastSegment}`)
  } catch (err) {
    return require(`../../img/uploadsImage/default-img.jpg`)
  }
}

const Message = ({  myUserNmae, Mymessage , isUser,  handleLikeMessage  }) => {
  let isLiked = false
  let countLikes = Mymessage.likes.length

  
  if(Mymessage.likes.includes(myUserNmae)){
      isLiked = true
  }

  if (isUser(Mymessage.username)) {
    return (
      <p className='user-message'>
         <img src={requireImage(Mymessage.imageUser)} alt='upload-' width="50" height="50" className='process_image text-center rounded-circle' />
         &nbsp; [{countLikes}] <br/>  {Mymessage.message}
      </p>
    )
  } else {
    return (
      <p className='not-user-message'>
         <img src={requireImage(Mymessage.imageUser)} alt='upload-' width="50" height="50" className='process_image text-center rounded-circle' />
         &nbsp; <strong>  {Mymessage.username}  </strong> 
        {(isLiked === true) ?
          (
            <button onClick={() => handleLikeMessage(Mymessage.date , Mymessage.username)} type="button" className="btn btn-default btn-sm">
              UnLike {countLikes} </button> 
            
          )
          :
          (
            <button onClick={() => handleLikeMessage(Mymessage.date , Mymessage.username)} type="button" className="btn btn-default btn-sm">
              Like {countLikes} </button>
          )
        } 
        <br/> {Mymessage.message}
      </p>
    )
  }
}

export default Message

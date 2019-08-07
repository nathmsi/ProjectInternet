import './chat.css'
import React from 'react'


const requireImage = (chemin) =>{
  try {
    var parts = chemin.split('\\')
    var lastSegment = parts.pop() || parts.pop()
    return require(`../../img/uploadsImage/user/${lastSegment}`)
  } catch (err) {
    return require(`../../img/uploadsImage/user/default-img.jpg`)
  }
}

const Message = ({  myUserNmae, Mymessage  , isUser,  handleLikeMessage  }) => {
  let isLiked = false
  let countLikes = Mymessage.likes.length

  
  if(Mymessage.likes.includes(myUserNmae)){
      isLiked = true
  }

  if (isUser(Mymessage.user.username)) {
    return (
      <p className='user-message'>
         <img src={requireImage(Mymessage.user.imageUser)} alt='upload-' width="50" height="50" className='process_image text-center rounded-circle' />
         &nbsp; [{countLikes}] <br/>  {Mymessage.message}
      </p>
    )
  } else {
    return (
      <p className='not-user-message'>
         <img src={requireImage(Mymessage.user.imageUser)} alt='upload-' width="50" height="50" className='process_image text-center rounded-circle' />
         &nbsp; <strong>  {Mymessage.user.username}  </strong>  &nbsp;
        {(isLiked === true) ?
          (
            <img src={require(`../../img/chat/15187653912696_ic_favorite.png`)} onClick={() => handleLikeMessage( Mymessage.id )} 
            alt='upload-' width="20" height="20" className='process_image text-center rounded-circle' />
          )
          :
          (
            <img src={require(`../../img/chat/15187654148852_ic_favorite_border.png`)} onClick={() => handleLikeMessage( Mymessage.id )} 
            alt='upload-' width="20" height="20" className='process_image text-center rounded-circle' />
          )
        }  {countLikes}  
        <br/> {Mymessage.message}
      </p>
    )
  }
}

export default Message

import './chat.css'
import React from 'react'

const Message = ({ username, myUserNmae, message, isUser, likes , handleLikeMessage , date }) => {
  let isLiked = false
  
  if(likes.includes(myUserNmae)){
      isLiked = true
  }

  if (isUser(username)) {
    return (
      <p className='user-message'>
        {message}
      </p>
    )
  } else {
    return (
      <p className='not-user-message'>
        <strong>{username} : </strong> {message}
        {(isLiked === true) ?
          (
            <button onClick={() => handleLikeMessage(date ,username)} type="button" className="btn btn-default btn-sm">
              UnLike</button>
          )
          :
          (
            <button onClick={() => handleLikeMessage(date ,username)} type="button" className="btn btn-default btn-sm">
              Like</button>
          )
        }
      </p>
    )
  }
}

export default Message

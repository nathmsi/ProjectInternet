import './chat.css'
import React from 'react'

const Message = ({ username, message, isUser }) => {

  if (isUser(username)) {
    return (
      <p className='user-message'>
        {message}
      </p>
    )
  } else {
    return (
      <p className='not-user-message'>
        <strong>{username}: </strong>{message}
      </p>
    )
  }
}

export default Message

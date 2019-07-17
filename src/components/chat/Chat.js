import '../../styles/ChatApp.css';
import React from 'react';
import Message from './Message';
import ChatInput from './ChatInput';
import './chat.css'
// Animations
import {
    CSSTransition,
    TransitionGroup
} from 'react-transition-group'


class ChatApp extends React.Component {



    addMessage = message => {
        const messageObject = {
            username: message.username,
            message: message.message,
            date: Date.now(),
            likes : [],
        };
        this.props.sendMessage(messageObject)
    }

    isUser = username => username === this.props.username




    render() {

        const { userOnline, messages, groupParticipants, username } = this.props

        const Listmessages = Object
            .keys(messages)
            .map(key => (
                    <CSSTransition
                        timeout={200}
                        classNames='fade'
                        key={key}>
                        <Message
                            isUser={this.isUser}
                            message={messages[key].message}
                            username={messages[key].username}
                            likes= {messages[key].likes}
                            myUserNmae={this.props.username}
                            date = {messages[key].date}
                            handleLikeMessage={this.props.handleLikeMessage} />
                    </CSSTransition>
            ))

        const onlineUser = Object
            .keys(userOnline)
            .map(key => (
                <UserOnline key={key} useronline={userOnline[key]} />
            ))



        const groupsUser = Object
            .keys(groupParticipants)
            .map(key => (
                <li key={key} className={`list-group-item d-flex justify-content-between align-items-center`}>
                    {groupParticipants[key]}
                </li>
            ))

        return (
            <div className=''>
                <div className="row">
                    <div className="col-8">
                        <div>
                            <div className='messages border' >
                                <TransitionGroup className='message'>
                                    {Listmessages}
                                </TransitionGroup>
                            </div>
                        </div>

                        <ChatInput
                            length={140}
                            username={username}
                            addMessage={this.addMessage} />
                        <br />
                    </div>
                    <div className="col-2 container"><br />
                        <h4 className='text-center'>  Online </h4><br />
                        <hr className="style1" />
                        <div className='messages boder' >
                            {onlineUser}
                        </div>
                    </div>
                    <div className="col-2 container"><br />
                        <h4 className='text-center'>  Participants </h4><br />
                        <hr className="style1" />
                        <div className='messages boder' >
                            {groupsUser}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}


const UserOnline = ({ useronline }) => {
    return (
        <li className={`text-success list-group-item d-flex justify-content-between align-items-center`}>
            {useronline}
        </li>
    )
}


export default ChatApp;

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

import Select from 'react-select';

import LoadingOverlay from 'react-loading-overlay';

class ChatApp extends React.Component {

    state = {
        usernames: [],
        selectedUsername: { value: "All", label: "All" },
        isLoading: false,
    }

    


    addMessage = message => {
        this.setState({ isLoading: true })
        const messageObject = {
            message: message.message,
            id : new Date().valueOf(),
            date : new Date(),
            likes: [],
            idUser: this.props.idUser,
            username : this.props.username
        };
        this.props.sendMessage(messageObject)
        this.setState({ isLoading: false })
    }

    isUser = username => username === this.props.username

    handleChangeUsername = (selectedUsername) => {
        this.setState({ isLoading: true })
        this.setState({ selectedUsername });
        this.setState({ isLoading: false })
    }

    




    render() {

        const { userOnline , messages, groupParticipants, username } = this.props

        const { selectedUsername } = this.state

        var  groupParticipant  = this.props.groupParticipants
        groupParticipant.unshift('All');
        const brands = groupParticipant.map(element => ({ value: element, label: element }))

        let FileterMessages = []
        messages.forEach(message => {
            if (message.username === selectedUsername.value || selectedUsername.value === 'All')
                FileterMessages.push(message)
        });



        const Listmessages = Object
            .keys(FileterMessages)
            .map(key => (
                <CSSTransition
                    timeout={200}
                    classNames='fade'
                    key={key}>
                    <Message
                        isUser={this.isUser}
                        myUserNmae={this.props.username}
                        Mymessage={FileterMessages[key]}
                        handleLikeMessage={this.props.handleLikeMessage} />
                </CSSTransition>
            ))


        var index = groupParticipants.indexOf('All');
        if (index !== -1) groupParticipants.splice(index, 1);

        const groupsUser = Object
            .keys(groupParticipants)
            .map(key => (
                <UserParticipants key={key} userOnline={userOnline} username={groupParticipants[key]} />
            ))

        return (
            <LoadingOverlay
                active={this.state.isLoading}
                spinner
                text='wait... '
            >
            <div className=''>
                <div className="row">
                    <div className="col-9">
                        <br />
                        <div className="row">
                            <div className="col-6">
                                <h4 className="input-group-addon text-center "> Filter Username </h4>
                            </div>
                            <div className="col-6">
                                <Select
                                    value={selectedUsername}
                                    onChange={this.handleChangeUsername}
                                    options={brands}
                                />
                            </div>
                        </div>
                        <br />
                        <div>
                            <div className='messages border' >
                                <TransitionGroup className='message'>
                                    {Listmessages}
                                </TransitionGroup>
                                <button onClick={this.props.getMoreMessage} type="button" className="btn btn-default btn-sm">
                                    getMoreMessage </button>
                            </div>
                        </div>

                        <ChatInput
                            length={140}
                            username={username}
                            addMessage={this.addMessage} />
                        <br />
                    </div>
                    <div className="col-3"><br />
                        <h4 className='text-center'>  Participants </h4><br />
                        <hr className="style1" />
                        <div className='' >
                            {groupsUser}
                        </div>
                    </div >
                </div>
            </div>
            </LoadingOverlay>
        );
    }

}


const UserParticipants = ({ userOnline, username }) => {
    if (userOnline.includes(username) ) {
        return (
            <li className={`text-success list-group-item d-flex justify-content-between align-items-center text-center`}>
                {username} [online]
            </li>
        )
    } else {
        return (
            <li className={` list-group-item d-flex justify-content-between align-items-center text-center`}>
                {username} [not-online]
            </li>
        )
    }
}


export default ChatApp;

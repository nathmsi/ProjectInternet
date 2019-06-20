import '../../styles/ChatApp.css';
import React from 'react';
import io from 'socket.io-client';
import Message from './Message';
import ChatInput from './ChatInput';
import './chat.css'
import CircularProgress from '@material-ui/core/CircularProgress';
// Animations
import {
    CSSTransition,
    TransitionGroup
} from 'react-transition-group'
class ChatApp extends React.Component {
    socket = {};

    state = {
        messages: {},
        userAuth: 'basic',
        username: '',
        userOnline: []
    }

    componentDidMount = async () => {
        let account = []
        await fetch('/users/account/', { method: 'get' }).then(res => res.text()).then(res => account = JSON.parse(res)).catch(err => err)

        if (account.level === 'manager' || account.level === 'client') {
            this.connectSocket(account)
            const { userOnline } = this.state
            userOnline.push({ username: account.username, statut: 'connection' })
            this.setState({ username: account.username, userAuth: account.level, userOnline: userOnline })
            console.log('<Chat> isAuth : ' + account.level)
        } else {
            this._isMounted && this.setState({ userAuth: 'basic' })
            console.log('<Chat> isAuth : ' + account.level)
            this.props.history.push('/Login')
        }
    }




    componentWillUnmount = () => {
        try {
            this.socket.close();
        }
        catch (err) {
            console.log('Socket disconnect err ' + err)
        }
        console.log('Socket disconnect')
    }

    connectSocket = (account) => {
        // Connect to the server
        this.socket = io('http://localhost:5555', { query: `username=${account.username}` }).connect();

        // Listen for messages from the server
        this.socket.on('server:message', message => {
            this.addMessage(message);
        });
        this.socket.on('server:connection', user => {
            const { userOnline } = this.state
            userOnline.push({ username: user, statut: 'connection' })
            this.setState({ userOnline: userOnline })
        });
        this.socket.on('server:disconnect', user => {
            const { userOnline } = this.state
            userOnline.push({ username: user, statut: 'disconnect' })
            this.setState({ userOnline: userOnline })
        });
    }


    addMessage = message => {
        const messageObject = {
            username: message.username,
            message: message.message
        };
        if (message.username === this.state.username)
            this.socket.emit('client:message', messageObject);

        const messages = { ...this.state.messages }
        messages[`message-${Date.now()}`] = messageObject
        this.setState({ messages })
    }

    isUser = username => username === this.state.username


    render() {
        const { userAuth, userOnline } = this.state
        if (userAuth === 'manager' || userAuth === 'client') {

            const messages = Object
                .keys(this.state.messages)
                .map(key => (
                    <CSSTransition
                        timeout={200}
                        classNames='fade'
                        key={key}>
                        <Message
                            isUser={this.isUser}
                            message={this.state.messages[key].message}
                            username={this.state.messages[key].username} />
                    </CSSTransition>
                ))

            const onlineUser = Object
                .keys(userOnline)
                .map(key => (
                    <UserOnline key={key} useronline={userOnline[key]} />
                ))

            return (
                <div className='container '>
                    <h2 className='text-center text-primary'>Chat Online </h2><br/>
                    <div className="row">
                        <div className="col-8">
                            <div>
                                <div className='messages border' >
                                    <TransitionGroup className='message'>
                                        {messages}
                                    </TransitionGroup>
                                </div>
                            </div>

                            <ChatInput
                                length={140}
                                username={this.state.username}
                                addMessage={this.addMessage} />
                            <br />
                        </div>
                        <div className="col-4">
                            <div className='messages ' >
                                {onlineUser}
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className='text-center'>
                    <p>Wait ...</p>
                    <CircularProgress disableShrink />
                </div>
            )
        }
    }

}


const UserOnline = ({ useronline }) => {
    if (useronline.statut === 'connection') {
        return (
            <div>
                <p className='text-success' >  {useronline.username} connected</p>
            </div>
        )

    } else {
        return (
            <div>
                <p className='text-danger'>  {useronline.username} disconnect </p>
            </div>
        )
    }
}


export default ChatApp;

import React from 'react';
import './chat.css'
import io from 'socket.io-client';
import Chat from './Chat'
import Groups from './Groups'
import GroupGestion from './GroupGestion'

import LoadingOverlay from 'react-loading-overlay';

import { ServerAPI } from "../../api/db"

class Blog extends React.Component {
    socket = null

    state = {
        userAuth: 'basic',
        username: '',
        groups: [],
        groupParticipants: [],
        group: [],
        messages: [],
        userOnline: [],
        isLoading: true,
        MyImgUser: '',
        idUser: ''
    }

    componentDidMount = async () => {
        try {
            let account = JSON.parse(await ServerAPI('/users/account/', 'get'))
            if (account.level === 'manager' || account.level === 'client' || account.level === 'creator') {
                const groups = JSON.parse(await this.dbGroupsList())
                this.setState({ username: account.username, userAuth: account.level, idUser: account._id, groups, MyImgUser: account.imageUser })
                console.log('<Blog> isAuth : ' + account.level)
            } else {
                this.setState({ userAuth: 'basic' })
                console.log('<Blog> isAuth : ' + account.level)
                this.props.history.push('/Login')
            }
            this.setState({ isLoading: false })
        } catch (err) {
            console.log(err)
            this.setState({ userAuth: 'basic' })
            this.setState({ isLoading: false })
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


    groupSelected = (id) => {
        this.setState({ isLoading: true })
        const groups = this.state.groups
        let groupParticipants = []
        let group = []
        groups.forEach(element => {
            if (element._id === id) {
                element.active = true
                groupParticipants = element.participants
                group = element
            } else {
                element.active = false
            }
        });
        this.setState({ groups, groupParticipants, group, messages: [], userOnline: [] })
        if (groupParticipants.includes(this.state.username)) {
            this.connectSocket(this.state.username, group.name, group._id)
        } else {
            this.setState({ isLoading: false })
            if (this.socket !== null) {
                this.socket.close()
                this.setState({ messages: [], userOnline: [] })
            }
        }
    }

    addGroup = async (name) => {
        this.setState({ isLoading: true })
        await ServerAPI('/groups/add', 'POST', { name })
        const groups = JSON.parse(await this.dbGroupsList())
        this.setState({ groups , group : [] })
        this.setState({ isLoading: false })
    }

    dbGroupsList = async () => {
        return await ServerAPI('/groups/', 'get')
    }

    deleteGroup = async (id) => {
        this.setState({ isLoading: true })
        await ServerAPI('/groups/delete', 'POST', { id })
        const groups = JSON.parse(await this.dbGroupsList())
        this.setState({ groups , group : [] })
        this.setState({ isLoading: false  })
    }

    deleteGroupParticipant = async (id, name, participants) => {
        this.setState({ isLoading: true })
        await ServerAPI('/groups/participant/delete', 'POST', { id, name, participants })
        const groups = JSON.parse(await this.dbGroupsList())
        this.setState({ groups , group : []  })
        this.setState({ isLoading: false })
    }

    addGroupRequest = async (group, name) => {
        this.setState({ isLoading: true })
        await ServerAPI('/groups/request/add', 'POST', { id: group._id, name, request: group.request })
        const groups = JSON.parse(await this.dbGroupsList())
        this.setState({ groups , group : [] })
        this.setState({ isLoading: false })
    }

    addGroupParticipant = async (id, name, request, participants) => {
        this.setState({ isLoading: true })
        await ServerAPI('/groups/participant/add', 'POST', { id, name, request, participants })
        const groups = JSON.parse(await this.dbGroupsList())
        this.setState({ groups , group : [] })
        this.setState({ isLoading: false })
    }

    connectSocket = (username, groupSelect, idGroup) => {
        if (this.socket !== null) {
            this.socket.close()
            this.setState({ messages: [], userOnline: [] })
        }
        this.socket = io('http://localhost:5555', { query: `username=${username}&groupName=${groupSelect}&idGroup=${idGroup}` }).connect();

        // Listen for messages from the server
        this.socket.on('server:message/' + groupSelect, messages => {
            this.setState({ messages: messages })
        });
        this.socket.on('server:connection/' + groupSelect, data => {
            this.setState({ userOnline: data.onlines, messages: data.messages })
        });
        this.socket.on('server:newuser/' + groupSelect, data => {
            this.setState({ userOnline: data.onlines })
        });
        this.setState({ isLoading: false })
    }

    sendMessage = (messageObject) => {
        let { messages } = this.state
        messageObject.imageUser = this.state.MyImgUser
        messages.push(messageObject)
        this.socket.emit('client:message/' + this.state.group.name, messageObject);
        this.setState({ messages: messages })
    }

    handleLikeMessage = (date, username) => {
        this.socket.emit('client:message/liked/' + this.state.group.name, { date, username });
    }

    getMoreMessage = () => {
        this.socket.emit('client:getMoreMessage' + this.state.group.name);
    }

    render() {
        const { userAuth, groups, username, groupParticipants, group } = this.state
        let flag = false

        if (userAuth === 'manager' || userAuth === 'client' || userAuth === 'creator') {
            flag = true
        }
        return (
            <LoadingOverlay
                active={this.state.isLoading}
                spinner
                text='wait a few time to access '
            >
                {
                    (flag === true) ?
                        (
                            <div className="row">
                                <div className="col-2">
                                    <Groups groups={groups} groupSelected={this.groupSelected} />
                                </div>
                                <div className="col-10">
                                    <div className="row">
                                        <div className="col-7 border bg-light">
                                            {
                                                (group.length === 0) ?
                                                    (
                                                        <div className="container text-center">
                                                            <br />
                                                            <h2> Select Group </h2>
                                                            <br />
                                                        </div>
                                                    )
                                                    :
                                                    (groupParticipants !== null && groupParticipants.includes(username)) ?
                                                        <Chat messages={this.state.messages} userOnline={this.state.userOnline}
                                                            username={this.state.username} groupParticipants={groupParticipants}
                                                            sendMessage={this.sendMessage} handleLikeMessage={this.handleLikeMessage}
                                                            idUser={this.state.idUser} getMoreMessage={this.getMoreMessage} />
                                                        :
                                                        (
                                                            <div className="container text-center">
                                                                <br />
                                                                <h3> Group name  " <strong> {group.name} </strong> "</h3>
                                                                <h2> You need to request access to Group </h2>
                                                                <button className='btn btn-success' onClick={() => this.addGroupRequest(group, username)}
                                                                >  + Request </button>
                                                                <br />
                                                            </div>
                                                        )
                                            }
                                        </div>
                                        <div className="col-5">
                                            {(userAuth === 'manager' || userAuth === 'creator') ?
                                                <GroupGestion addGroup={this.addGroup} deleteGroupParticipant={this.deleteGroupParticipant} deleteGroup={this.deleteGroup}
                                                    addGroupParticipant={this.addGroupParticipant} groups={groups} /> :
                                                <></>
                                            }
                                        </div>
                                    </div>
                                </div>

                            </div>
                        )
                        :
                        <></>
                }

            </LoadingOverlay>
        )

    }

}





export default Blog

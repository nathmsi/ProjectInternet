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
        idUser: '',
        users: [],
        chatSelected: true
    }

    componentDidMount = async () => {
        try {
            document.title = 'Blog / Car Sale'
            let account = JSON.parse(await ServerAPI('/users/account/', 'get'))
            if (account.level === 'manager' || account.level === 'client' || account.level === 'creator') {
                const groups = JSON.parse(await this.dbGroupsList())
                groups.forEach(element => {
                    element.participantsSelect = false
                    element.requestSelect = false
                });
                const users = this.setUsers(JSON.parse(await ServerAPI('/users/', 'get')))
                this.setState({ username: account.username, userAuth: account.level, idUser: account._id, groups, MyImgUser: account.imageUser, users })
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

    setUsers = (users) => {
        let result = []
        users.forEach(user => {
            result[user._id] = user
        })
        return result
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
        this.setState({ groups, group: [] })
        this.setState({ isLoading: false })
    }

    dbGroupsList = async () => {
        return await ServerAPI('/groups/', 'get')
    }

    deleteGroup = async (id) => {
        this.setState({ isLoading: true  })
        if (this.socket !== null) {
            this.socket.close()
            this.setState({ messages: [], userOnline: [] ,  group : [] })
        }
        await ServerAPI('/groups/delete', 'POST', { id })
        const groups = JSON.parse(await this.dbGroupsList())
        this.setState({ groups, group: [] })
        this.setState({ isLoading: false })
    }

    deleteGroupParticipant = async (id, name, participants) => {
        this.setState({ isLoading: true })
        await ServerAPI('/groups/participant/delete', 'POST', { id, name, participants })
        const groups = JSON.parse(await this.dbGroupsList())
        this.setState({ groups, group: [] })
        this.setState({ isLoading: false })
    }

    addGroupRequest = async (group, name) => {
        this.setState({ isLoading: true })
        await ServerAPI('/groups/request/add', 'POST', { id: group._id, name, request: group.request })
        const groups = JSON.parse(await this.dbGroupsList())
        this.setState({ groups, group: [] })
        this.setState({ isLoading: false })
    }

    addGroupParticipant = async (id, name, request, participants) => {
        this.setState({ isLoading: true })
        await ServerAPI('/groups/participant/add', 'POST', { id, name, request, participants })
        const groups = JSON.parse(await this.dbGroupsList())
        this.setState({ groups, group: [] })
        this.setState({ isLoading: false })
    }

    connectSocket = (username, groupSelect, idGroup) => {
        if (this.socket !== null) {
            this.socket.close()
            this.setState({ messages: [], userOnline: [] })
        }
        let Myip = ''
        var findIP = new Promise(r => { var w = window, a = new (w.RTCPeerConnection || w.mozRTCPeerConnection || w.webkitRTCPeerConnection)({ iceServers: [] }), b = () => { }; a.createDataChannel(""); a.createOffer(c => a.setLocalDescription(c, b, b), b); a.onicecandidate = c => { try { c.candidate.candidate.match(/([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g).forEach(r) } catch (e) { } } })
        findIP.then(ip => { Myip = ip })
            .catch(e => console.log(e))

        let server = 'http://' + Myip + ':5555/' // localhost:5555 
        this.socket = io(server, { query: `username=${username}&groupName=${groupSelect}&idGroup=${idGroup}` }).connect();

        // Listen for messages from the server
        this.socket.on('server:message/' + groupSelect, messages => {
            messages.forEach(message => {
                message.user = this.state.users[message.idUser]
            })
            this.setState({ messages: messages })
        });
        this.socket.on('server:connection/' + groupSelect, data => {
            data.messages.forEach(message => {
                message.user = this.state.users[message.idUser]
            })
            this.setState({ userOnline: data.onlines, messages: data.messages })
        });
        this.socket.on('server:newuser/' + groupSelect, data => {
            this.setState({ userOnline: data.onlines })
        });
        this.setState({ isLoading: false })
    }

    sendMessage = (messageObject) => {
        let { messages } = this.state
        this.socket.emit('client:message/' + this.state.group.name, messageObject)
        messageObject.user = this.state.users[messageObject.idUser]
        messages.push(messageObject)
        this.setState({ messages: messages })
    }

    handleLikeMessage = (id) => {
        console.log(111)
        this.socket.emit('client:message/liked/' + this.state.group.name, { id });
    }

    getMoreMessage = () => {
        this.socket.emit('client:getMoreMessage' + this.state.group.name);
    }

    ChatSelected = () => {
        this.setState({ chatSelected: !this.state.chatSelected })
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
                text={<h2 className='text-dark'>Please wait a few time ...</h2>}
            >
                {
                    (flag === true && this.state.isLoading === false ) ?
                        (
                            <div className="row">
                                <div className="col-3  container bg-light">
                                    <br />
                                    <div className="rounded-pill bg-primary text-white text-center">
                                        <h3> Select Group </h3>
                                    </div>
                                    <br />
                                    <Groups groups={groups} groupSelected={this.groupSelected} />
                                    <br />
                                </div>
                                <div className="col-9">
                                    <div className="row">
                                        <div className="col-12 border bg-light">
                                            <br />
                                            <div className="rounded-pill bg-primary text-white text-center">
                                                <h3  onClick={this.ChatSelected}> Chat  &nbsp;  {this.state.chatSelected === true ? (<>-</>) : (<>+</>)} </h3>
                                            </div>
                                            {this.state.chatSelected === true &&
                                                (
                                                    <>
                                                        {
                                                            (group.length === 0) ?
                                                                (
                                                                    <div className="container text-center">
                                                                        <br />
                                                                        <h2> Select your Group </h2>
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
                                                                        (group.request.includes(username)) ?
                                                                            (
                                                                                <div className="container text-center">
                                                                                    <br />
                                                                                    <h3> Group name  " <strong> {group.name} </strong> "</h3>
                                                                                    <h2> your request sent <br /> you need to wait confirmation manager </h2>
                                                                                    <br />
                                                                                </div>
                                                                            )
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
                                                                    )
                                                        }
                                                    </>
                                                )}
                                            {(userAuth === 'manager' || userAuth === 'creator') ?
                                                <GroupGestion addGroup={this.addGroup} deleteGroupParticipant={this.deleteGroupParticipant} deleteGroup={this.deleteGroup}
                                                    addGroupParticipant={this.addGroupParticipant} groups={groups} /> :
                                                <></>
                                            }
                                        </div>
                                        {/* <div className="col-5">
                                            
                                        </div> */}
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

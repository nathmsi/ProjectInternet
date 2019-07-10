import React from 'react';
import './chat.css'

import CircularProgress from '@material-ui/core/CircularProgress';
import Chat from './Chat'
import Groups from '../screen/Groups'
import GroupGestion from '../screen/GroupGestion'


import { dbGroupsList } from "../../api/db"

class Blog extends React.Component {
    socket = {};

    state = {
        userAuth: 'basic',
        username: '',
        groups: [],
        groupSelect: [],
        group: []
    }

    componentDidMount = async () => {
        let account = []
        await fetch('/users/account/', { method: 'get' }).then(res => res.text()).then(res => account = JSON.parse(res)).catch(err => err)
        if (account.level === 'manager' || account.level === 'client') {
            const groups = JSON.parse(await dbGroupsList())
            this.setState({ username: account.username, userAuth: account.level, groups })
            if(groups.length !== 0) this.groupSelected(groups[0]._id)
            console.log('<Blog> isAuth : ' + account.level)
        } else {
            this.setState({ userAuth: 'basic' })
            console.log('<Blog> isAuth : ' + account.level)
            this.props.history.push('/Login')
        }
    }




    componentWillUnmount = () => {
    }

    groupSelected = (id) => {
        const groups = this.state.groups
        let groupSelect = []
        let group = []
        groups.forEach(element => {
            if (element._id === id) {
                element.active = true
                groupSelect = element.participants
                group = element
            } else {
                element.active = false
            }
        });

        this.setState({ groups, groupSelect, group })
    }

    addGroup = async (name) => {
        await fetch('/groups/add', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name })
        })
        const groups = JSON.parse(await dbGroupsList())
        this.setState({ groups })
    }

    deleteGroup = async (id) => {
        await fetch('/groups/delete', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id })
        })
        const groups = JSON.parse(await dbGroupsList())
        this.setState({ groups })
    }

    deleteGroupParticipant = async (id, name, participants) => {
        await fetch('/groups/participant/delete', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id, name, participants })
        })
        const groups = JSON.parse(await dbGroupsList())
        this.setState({ groups })
    }

    addGroupRequest = async (group, name) => {
        await fetch('/groups/request/add', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: group._id, name, request: group.request })
        })
        const groups = JSON.parse(await dbGroupsList())
        this.setState({ groups })
    }

    addGroupParticipant = async (id, name, request, participants) => {
        await fetch('/groups/participant/add', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id, name, request, participants })
        })
        const groups = JSON.parse(await dbGroupsList())
        this.setState({ groups })
    }


    render() {
        const { userAuth, groups, username, groupSelect, group } = this.state



        if (userAuth === 'manager' || userAuth === 'client') {
            return (
                <div className="row">
                    <div className="col-3">
                        <Groups groups={groups} groupSelected={this.groupSelected} />
                    </div>
                    <div className="col-9">
                        <div className="row">
                            <div className="col-8 border bg-light">
                                {
                                    groupSelect.includes(username) ?
                                        <Chat groupSelect={groupSelect} />
                                        :
                                        (
                                            <div className="container text-center">
                                                <br />
                                                <h3> Group Name  <strong>{group.name} </strong></h3>
                                                <h2> You need to request access to Group </h2>
                                                <button className='btn btn-success' onClick={() => this.addGroupRequest(group, username)}
                                                >  + Request </button>
                                                <br />
                                            </div>
                                        )
                                }
                            </div>
                            <div className="col-4">
                                {(userAuth === 'manager') ?
                                    <GroupGestion addGroup={this.addGroup} deleteGroupParticipant={this.deleteGroupParticipant} deleteGroup={this.deleteGroup}
                                    addGroupParticipant={this.addGroupParticipant} groups={groups} /> :
                                    <></>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            )
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





export default Blog

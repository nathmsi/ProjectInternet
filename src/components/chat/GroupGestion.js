import React, { Component } from "react";


class GroupGestion extends Component {

  state = {
    name: '',
    isLoaded: true,
    groups: [],
    groupselectElement: [],
    newGroupSelect: false,
    newGroupGestion: false
  }

  updateInputValuename = (event) => {
    const { value } = event.target
    this.setState({ name: value })
  }
  componentDidMount = () => {
    try {
      this.props.groups.forEach(element => {
        element.participantsSelect = false
        element.requestSelect = false
      });
      this.setState({ groups: this.props.groups, isLoaded: true })
    } catch (err) {
      console.log(err)
    }

  }

  selectParticipants = (id) => {
    this.props.groups.forEach(element => {
      if (element._id === id) {
        element.participantsSelect = !element.participantsSelect
      }
    });
    this.setState({ groups: this.props.groups })
  }

  selectRequest = (id) => {
    this.props.groups.forEach(element => {
      if (element._id === id) {
        element.requestSelect = !element.requestSelect
      }
    });
    this.setState({ groups: this.props.groups })
  }

  newGroupSelected = () => {
    this.setState({
      newGroupSelect: !this.state.newGroupSelect
    })
  }

  newGroupGestion_ = () => {
    this.setState({
      newGroupGestion: !this.state.newGroupGestion
    })
  }




  render() {


    if (this.state.isLoaded) {

      let groupsList = <></>
      groupsList = Object.keys(this.props.groups)
        .map(key => <Element key={key} element={this.props.groups[key]}
          deleteGroupParticipant={this.props.deleteGroupParticipant} addGroupParticipant={this.props.addGroupParticipant} deleteGroup={this.props.deleteGroup}
          selectParticipants={this.selectParticipants} selectRequest={this.selectRequest}
        ></Element>)

      return (

        <div className="  bg-light">

          <div className="grey-text">
            <br />
            <h3 className="text-center rounded-pill bg-primary text-white " onClick={this.newGroupSelected}>Add New Group
            &nbsp;  {this.state.newGroupSelect === true ? (<>-</>) : (<>+</>)}</h3>
            <br />
          </div>

          {this.state.newGroupSelect === true &&
            (
              <>
                <div className="row ">
                  <div className="col-4">
                    <h4 className="input-group-addon text-center"> Name of group  </h4>
                  </div>
                  <div className="col-8">
                    <input type='name' value={this.state.name} name='name' className="form-control" onChange={this.updateInputValuename} />
                  </div>
                </div>


                <div className="row ">
                  <div className="col-4"></div>
                  <div className="col-8">
                    <button
                      className="btn  btn-primary  btn-lg btn-block"
                      onClick={() => this.props.addGroup(this.state.name)}
                    >Add</button>
                  </div>
                </div>
                <br />
              </>
            )}

          <h3 className="text-center rounded-pill bg-primary text-white " onClick={this.newGroupGestion_} >Gestion Group
          &nbsp;  {this.state.newGroupGestion === true ? (<>-</>) : (<>+</>)}</h3>

          {this.state.newGroupGestion === true &&
            (
              <div className="">
                {groupsList}
              </div>
            )
          }
          <br />
        </div >

      )
    } else {
      return (
        <></>
      )
    }
  }
}


const Element = ({ element, deleteGroupParticipant, addGroupParticipant, deleteGroup, selectParticipants, selectRequest }) => {
  const participants = element.participants
  const request = element.request


  let participantsList = <></>
  participantsList = Object.keys(participants)
    .map(key =>
      <div key={key} className="text-center"  >
        name : {participants[key]}
        <span className="badge  badge-pill">
          <div className='col-sm-4'>
            <button className='btn btn-outline-success' onClick={() => deleteGroupParticipant(element._id, participants[key], participants)}
            >Delete</button>
          </div>
        </span>
      </div>
    )
  let RequestsList = <></>
  RequestsList = Object.keys(request)
    .map(key =>
      <div key={key} className="text-center"  >
        name : {request[key]}
        <span className="badge  badge-pill">
          <div className='col-sm-4'>
            <button className='btn btn-outline-success' onClick={() => addGroupParticipant(element._id, request[key], request, participants)}
            >Add</button>
          </div>
        </span>
      </div>
    )

  return (
    <div>
      <br />
      <div className=" border border-primary">
        <div className=" " >
          <div className="row =">
            <div className="col-9">
              <h4 className="text-center  text-black">{element.name} </h4>
            </div>
            <div className="col-3 ">
              <button className='btn btn-danger btn-sm' onClick={() => deleteGroup(element._id)}
              >Delete Group</button>
            </div>
          </div>
          <br />
          <div className="p-2 mb-2 bg-secondary text-white" onClick={() => selectParticipants(element._id)} >
            <span className="badge badge-primary badge-pill text-right">{element.participants.length}</span>  &nbsp;
            participants
        </div>
          {
            participantsList.length !== 0 &&
            <div className='GroupGestionScroll'>
              {participantsList}
            </div>
          }
          <div className="p-2 mb-2 bg-secondary text-white" onClick={() => selectRequest(element._id)} >
            <span className="badge badge-primary badge-pill pull-right">{element.request.length}</span>  &nbsp;
            Requests
        </div>
          {
            RequestsList.length !== 0 &&
            <div className='GroupGestionScroll'>
              {RequestsList}
            </div>
          }
        </div>
      </div>
      <br />
    </div>
  )
}


export default GroupGestion;
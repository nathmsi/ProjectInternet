import React, { Component } from "react";


class GroupGestion extends Component {

  state = {
    name: '',
  }

  updateInputValuename = (event) => {
    const { value } = event.target
    this.setState({ name: value })
  }


  render() {


    let groupsList = <></>
    groupsList = Object.keys(this.props.groups)
      .map(key => <Element key={key} element={this.props.groups[key]}
        deleteGroupParticipant={this.props.deleteGroupParticipant} addGroupParticipant={this.props.addGroupParticipant}
        deleteGroup={this.props.deleteGroup}></Element>)

    return (
      <div className="container border bg-light">

        <div className="grey-text">
          <p className="h4 text-center py-4">Add New Group</p>
          <div className="row ">
            <div className="col-4">
              <h4 className="input-group-addon"> Name of group  </h4>
            </div>
            <div className="col-8">
              <input type='name' value={this.state.name} name='name' className="form-control" onChange={this.updateInputValuename} />
            </div>
          </div>
        </div>

        <div >
          <button
            className="btn  btn-primary  btn-lg btn-block"
            onClick={() => this.props.addGroup(this.state.name)}
          >Add</button>
        </div>

        <br />


        <p className="h4 text-center py-4">Gestion Group</p>
        <div className="blogScrool">
          {groupsList}
        </div>

        <br />

      </div>

    )
  }
}


const Element = ({ element, deleteGroupParticipant, addGroupParticipant, deleteGroup }) => {
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
      <div className="border " >
        <div className="row ">
          <div className="col-9">
            <h6 className="text-center"><div className="p-3 mb-2  bg-dark text-white">{element.name}</div></h6>
          </div>
          <div className="col-3">
            <button className='btn btn-danger btn-sm' onClick={() => deleteGroup(element._id)}
            >Delete Group</button>
          </div>
        </div>
        <div className="p-2 mb-2 bg-primary text-white"> participants </div>
        {participantsList}
        <div className="p-2 mb-2 bg-primary text-white">Requests </div>
        {RequestsList}
      </div>
    </div>
  )
}


export default GroupGestion;
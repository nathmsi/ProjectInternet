import React from "react";



const List = ({ groups, groupSelected  }) => {
  let groupsList = <></>
  groupsList = Object.keys(groups)
    .map(key => <Element key={key} element={groups[key]} groupSelected={groupSelected} ></Element>)


  return (
    <ul className="list-group">
      {groupsList}
    </ul>
  )
}


const Element = ({ element, groupSelected }) => {
  let active = ""
  if (element.active === true)  
      active = "active"
  else
      active = ""

  return (
    <div  onClick={() => groupSelected(element._id)}>
    <li className={`list-group-item d-flex justify-content-between align-items-center ${active}`}>
      {element.name}
      <span className="badge badge-primary badge-pill">{element.participants.length}</span>
    </li>
    </div>
  )
}




export default List;
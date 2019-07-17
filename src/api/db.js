


const ServerAPI = async (path,method,body) =>{
  let response = ''
  await fetch(path , {
    method: method,
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
    .then(res => res.text())
    .then(res => response = res)
    .catch(err => console.log( 'path error ' + path + ' ' + err))

  return response
}


export {
  ServerAPI
}


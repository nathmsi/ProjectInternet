


const ServerAPI = async (path, method, body) => {
  try {
    let response = ''
    await fetch(path, {
      method: method,
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })
      .then(res => res.text())
      .then(res => response = res)
      .catch(err => console.log('path error ' + path + ' ' + err))
    return response
  }
  catch (err) {
    console.log('path error ' + path + ' ' + err)
    return ''
  }
}


export {
  ServerAPI
}


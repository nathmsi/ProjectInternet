

const loginDatabase = async (user,password) => {

    let response = ''

    var details = {
        'username': user,
        'password': password
    };
    
    var formBody = [];
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    
    await fetch('/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: formBody 
    })
    .then(res => res.text())
    .then(res => response = res)
    .catch(err => err);

    return response
}

const registerDatabase = async (user,password,email,level) => {

  let response = ''

  var details = {
      'username': user,
      'password': password,
      'level' : level,
      'email' : email
  };
  
  var formBody = [];
  for (var property in details) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(details[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");
  
  await fetch('/users/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: formBody
  })
  .then(res => res.text())
  .then(res => response = res)
  .catch(err => err);

  return response
}



const dbComputersList = async () => {

  let response = {}
 
   await fetch('/computers/', {method: 'get'})
  .then(res => res.text())
  .then(res => response = res)
  .catch(err => err);

  return response
}

const dbUsersList = async () => {

  let response = {}
 
   await fetch('/users/', {method: 'get'})
  .then(res => res.text())
  .then(res => response = res)
  .catch(err => err);

  return response
}




const dbAddComputer = async (name, image, price,brand,cpu,sizeScreen,
  OperatingSystem,capacity,MemorySize) => {
  let response = ''

  var details = {
      'name': name,
      'image': image,
      'price': price,
      'brand': brand,
      'cpu': cpu,
      'sizeScreen': sizeScreen,
      'OperatingSystem': OperatingSystem,
      'capacity': capacity,
      'MemorySize': MemorySize,
  };
  
  var formBody = [];
  for (var property in details) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(details[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");
  
  await fetch('/computers/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: formBody
  })
  .then(res => res.text())
  .then(res => response = res)
  .catch(err => err);

  return response

}
const dbUpdateComputer = async (id,name, image, price,brand,cpu,sizeScreen,
  OperatingSystem,capacity,MemorySize) => {
  let response = ''

  var details = {
      'id' : id,
      'name': name,
      'image': image,
      'price': price,
      'brand': brand,
      'cpu': cpu,
      'sizeScreen': sizeScreen,
      'OperatingSystem': OperatingSystem,
      'capacity': capacity,
      'MemorySize': MemorySize,
  };
  
  var formBody = [];
  for (var property in details) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(details[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");
  
  await fetch('/computers/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: formBody
  })
  .then(res => res.text())
  .then(res => response = res)
  .catch(err => err);

  return response

}


const dbDeleteUser = async (id) => {

  let response = ''

  var details = {
      'id': id,
  };
  
  var formBody = [];
  for (var property in details) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(details[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");
  
  await fetch('/users/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: formBody
  })
  .then(res => res.text())
  .then(res => response = res)
  .catch(err => err);

  return response
}

const dbAddPanier = async (id) => {

  let response = ''

  var details = {
      'id': id
  };
  
  var formBody = [];
  for (var property in details) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(details[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");
  
  await fetch('/users/panier/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: formBody
  })
  .then(res => res.text())
  .then(res => response = res)
  .catch(err => err);

  return response
}

const dbDeletePanier = async (id) => {

  let response = ''

  var details = {
      'id': id
  };
  
  var formBody = [];
  for (var property in details) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(details[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");
  
  await fetch('/users/panier/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: formBody
  })
  .then(res => res.text())
  .then(res => response = res)
  .catch(err => err);

  return response
}

const dbDeleteOnePanier = async (id) => {

  let response = ''

  var details = {
      'id': id
  };
  
  var formBody = [];
  for (var property in details) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(details[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");
  
  await fetch('/users/panier/deleteOne', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: formBody
  })
  .then(res => res.text())
  .then(res => response = res)
  .catch(err => err);

  return response
}


const dbDeletecomputer = async (id) => {

  let response = ''

  var details = {
      'id': id,
  };
  
  var formBody = [];
  for (var property in details) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(details[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");
  
  await fetch('/computers/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: formBody
  })
  .then(res => res.text())
  .then(res => response = res)
  .catch(err => err);

  return response
}
const dbupdateUserLevel = async (id , level) => {

  let response = ''

  var details = {
      'id': id,
      'level': level
  };
  
  var formBody = [];
  for (var property in details) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(details[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");
  
  await fetch('/users/level', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: formBody
  })
  .then(res => res.text())
  .then(res => response = res)
  .catch(err => err);

  return response
}

const dbAddOrder = async (order , total) => {

  let response = ''

  var details = {
      'order': order,
      'total' : total
  };
  
  var formBody = [];
  for (var property in details) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(details[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");
  
  await fetch('/users/orders/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: formBody
  })
  .then(res => res.text())
  .then(res => response = res)
  .catch(err => err);

  return response
}

export { 
  loginDatabase ,
  registerDatabase , 
  dbUsersList , 
  dbDeleteUser ,
  dbAddPanier ,
  dbDeletePanier,
  dbupdateUserLevel,
  dbComputersList,
  dbDeletecomputer,
  dbAddComputer,
  dbUpdateComputer,
  dbDeleteOnePanier,
  dbAddOrder
}


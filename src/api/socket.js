import openSocket from 'socket.io-client';
const  socket = openSocket('/');

function newUser(username) {
    socket.emit('nouveau_client', username);
}

export { newUser };
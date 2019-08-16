var http = require('http')
var io = require('socket.io')
var express = require('express');
var router = express.Router();
var Group = require('./model/Group');
var User = require('./model/User');
var mongoose = require('mongoose')


const server = http.createServer(router);
const socketIo = io(server);




// Start listening
server.listen(process.env.PORT || '5555');
// Setup socket.io
socketIo.on('connection', async socket => {

    const username = socket.handshake.query.username;
    const groupName = socket.handshake.query.groupName
    const idGroup = socket.handshake.query.idGroup
    var count = 1

    getGroupMessages = async (idGroup) => {
        try {
            let id = new mongoose.mongo.ObjectID(idGroup)
            let group = await Group.findOne({ _id: id })
            let messages = [] 
            messages = group.messages
            if(messages.length > (15*count)){
                messages = messages.slice(Math.max(messages.length - (15*count), 1))
            }
            //console.log(count,messages.length)
            return messages
        }
        catch (err) {
            console.log(err)
            return messages
        }
    }


    getGroupOnlines = async (idGroup) => {
        try {
            let id = new mongoose.mongo.ObjectID(idGroup)
            let group = await Group.findOne({ _id: id })
            if(group !== undefined)
                return group.onlines
            else
                return []
        }
        catch (err) {
            console.log(err)
            return messages
        }
    }

    getNameImageByUserId = async (id) => {
        try {
            let _id = new mongoose.mongo.ObjectID(id)
            let user = await User.findOne({ _id })
            return user.imageUser
        }
        catch (err) {
            console.log(err)
            return _id
        }
    }

    addOnlineToGroup = async (idGroup, username) => {
        try {
            let onlines = (await getGroupOnlines(idGroup))
            onlines.push(username)
            let id = new mongoose.mongo.ObjectID(idGroup)
            let body = {
                onlines
            }
            Group.findByIdAndUpdate(id, body, { new: true }, function (err) {
                if (err) return console.log('problem ' + 'addOnlineToGroup ' + err)
            });
        }
        catch (err) {
            console.log(err)
            return []
        }
    }

    addMessageToGroup = async (idGroup, message) => {
        try {
            let messages = (await getGroupMessages(idGroup))
            messages.push(message)
            let id = new mongoose.mongo.ObjectID(idGroup)
            let body = {
                messages
            }
            Group.findByIdAndUpdate(id, body, { new: true }, function (err) {
                if (err) return console.log('problem ' + 'addMessageToGroup ' + err)
            });
        }
        catch (err) {
            console.log(err)
            return []
        }
    }

    deleteOnlineToGroup = async (idGroup, username) => {
        try {
            let onlines = (await getGroupOnlines(idGroup))
            var index_ = onlines.indexOf(username);
            if (index_ !== -1) onlines.splice(index_, 1);
            let id = new mongoose.mongo.ObjectID(idGroup)
            let body = {
                onlines
            }
            Group.findByIdAndUpdate(id, body, { new: true }, function (err) {
                if (err) return console.log('problem ' + 'addOnlineToGroup ' + err)
            });
        }
        catch (err) {
            console.log(err)
            return []
        }
    }

    likeMessageGroup = async (idGroup, Themessage, username ) => {
        let messages = await getGroupMessages(idGroup)
        messages.forEach(message => {
            if ( message.id === Themessage.id) {
                if (message.likes.includes(username)) {
                    var index_ = message.likes.indexOf(username);
                    if (index_ !== -1) message.likes.splice(index_, 1);
                } else {
                    message.likes.push(username)
                }
            }
        })
        let id = new mongoose.mongo.ObjectID(idGroup)
        let body = {
            messages
        }
        Group.findByIdAndUpdate(id, body, { new: true }, function (err, user) {
            if (err) return console.log('problem ' + 'likeMessageGroup')
        });
    }



    console.log(`${username} connected ` + 'GroupName ' + groupName);




    try {
        await addOnlineToGroup(idGroup, username)
        let onlines = await getGroupOnlines(idGroup)
        let messages = await getGroupMessages(idGroup)
        socket.broadcast.emit('server:newuser/' + groupName, { onlines });  // broadcast to emit new user online 
        socket.emit('server:connection/' + groupName, { onlines , messages });
    }
    catch (err) {
        console.log(err)
    }




    socket.on('client:message/' + groupName, async data => {
        try {
            await addMessageToGroup(idGroup, data)
            let messages = await getGroupMessages(idGroup)
            socket.broadcast.emit('server:message/' + groupName, messages)
        }
        catch (err) {
            console.log(err)
        }
    });


    socket.on('client:message/liked/' + groupName, async data => {
        try {
            await likeMessageGroup(idGroup, data, username)
            let messages = await getGroupMessages(idGroup)
            socket.broadcast.emit('server:message/' + groupName, messages);
            socket.emit('server:message/' + groupName, messages);
        }
        catch (err) {
            console.log(err)
        }
    });

    socket.on('client:getMoreMessage' + groupName, async () => {
        try {
            count++
            let messages = await getGroupMessages(idGroup)
            socket.emit('server:message/' + groupName, messages);
        }
        catch (err) {
            console.log(err)
        }
    });



    socket.on('disconnect', async () => {
        try {
            // var index = Groups[groupName].onlines.indexOf(username);
            // if (index !== -1) Groups[groupName].onlines.splice(index, 1);
            await deleteOnlineToGroup(idGroup, username)
            let onlines = await getGroupOnlines(idGroup)
            console.log(`${username} disconnected` + ' GroupName ' + groupName);
            // socket.broadcast.emit('server:newuser/' + groupName, { onlines: Groups[groupName].onlines });  // broadcast to emit i am disconnect
            socket.broadcast.emit('server:newuser/' + groupName, { onlines });  // broadcast to emit i am disconnect
        }
        catch (err) {
            console.log(err)
        }
    });







});






module.exports = router;
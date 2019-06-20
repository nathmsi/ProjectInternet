// db.js
var mongoose = require('mongoose')


module.exports.connect = () =>{
    mongoose.connect('mongodb://localhost:27017/userDB', { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true } ,function(err) {
        if (err) { 
            reject(err); 
            console.log('error database localhost:27017/userDB')
            return; 
        };
    })
    console.log('Database connected mongodb://localhost:27017/userDB')
}


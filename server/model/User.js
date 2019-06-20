// User.js
const passportLocalMongoose = require('passport-local-mongoose')
var mongoose = require('mongoose'); 


const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  phone : String,
  address : String,
  level: String,
  email : String ,
  panier: [],
  orders: []
})



UserSchema.plugin(passportLocalMongoose);

mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');
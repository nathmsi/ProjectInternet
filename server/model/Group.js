// Computer.js
var mongoose = require('mongoose'); 


const GroupSchema = new mongoose.Schema({
    item : { type: String , require: true , index:true , unique:true , sparse:true } ,
    name: String,
    participants : [],
    request : [],
    messages : [],
    isAccept : Boolean
})


mongoose.model('Group', GroupSchema);

module.exports = mongoose.model('Group');
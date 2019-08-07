// Computer.js
var mongoose = require('mongoose'); 


const ComputerSchema = new mongoose.Schema({
    item : { type: String , require: true , index:true , unique:true , sparse:true } ,
    brand: String,
    image : String,
    name: String ,
    cpu: String,
    sizeScreen: String,
    OperatingSystem: String,
    capacity: String ,
    MemorySize: String,
    price : String,
    count : String
})


mongoose.model('Computer', ComputerSchema);

module.exports = mongoose.model('Computer');
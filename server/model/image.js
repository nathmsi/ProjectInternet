// Computer.js
var mongoose = require('mongoose'); 


const ImageSchema = new mongoose.Schema({
    imageName:{
        type : String,
        default : "none",
        required : true
    },
    imageData :{
        type : String,
        required : true
    },
    Iduser :{
        type : String,
    }
})


mongoose.model('Image', ImageSchema);

module.exports = mongoose.model('Image');
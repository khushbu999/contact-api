const mongoose = require('mongoose')

const contactSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    firstName:{type:String, required:true},
    lastName:{type:String,required:true},
    email:{type:String,required:true},
    address:{type:String,required:true},
    phone:{type:String,required:true},
    userId:{type:String,require:true}
})

module.exports = mongoose.model('Contact',contactSchema);
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    password:{type:String,required: true,min:6},
    email:{type:String,required:true,unique:true},
    isActivated:{type:Boolean,default:false},
    activationLink:{type:String}
})

module.exports = mongoose.model('User', userSchema)
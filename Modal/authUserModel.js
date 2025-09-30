const mongoose = require('mongoose')

const authUserSchema = mongoose.Schema({
    nanoid:{
        type:String,
        required:true,
        unique: true
    },
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type: String,
        required:true,
        unique:true
    },
    password:{
        type: String,
        required:true,
        trim: true
    }
   


})

module.exports=mongoose.model('AuthUser',authUserSchema)
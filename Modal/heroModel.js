const mongoose=require('mongoose')

const heroSchema= mongoose.Schema({
    nanoid:{
        type:String,
        required:true,
        unique: true
    },
    imgUrl:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    hero_about:{
        type:String,
        required:true
    }
})

module.exports=mongoose.model('Hero',heroSchema)
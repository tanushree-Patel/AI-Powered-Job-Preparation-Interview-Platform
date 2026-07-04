const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:[true,'username already taken'],
    },
        email:{
        type:String,
        unique:[true,'Account already exists with this email address'],
        required:true,
    },
        password:{
        type:String,
        required:true,
    },
    verified:{
        type:Boolean,
        default:false
    }
})

const userModel=mongoose.model('User',userSchema)

module.exports=userModel
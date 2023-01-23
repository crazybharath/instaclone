const mongoose=require("mongoose");
const users=mongoose.Schema({
    username:{
        type:String
    },
    location:{
        type:String
    },
    description:{
        type:String
    },
    imagefile:{
        type:String
    },
    date:{
        type:Date,
        default:new Date()
    }
    
})
module.exports=mongoose.model("simpleusers",users);
const mongoose=require("mongoose")

const profileSchema=new mongoose.Schema({
    userId:{
        // type:String
        type:mongoose.Types.ObjectId
    },
    address:{
        type:String
    },
    phone:{
        type:Number
    },
    pin:{
        type:Number
    }
})

const Profile = mongoose.model('Profiles', profileSchema);

module.exports = Profile;
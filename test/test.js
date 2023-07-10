// const mongoose=require("mongoose");
// const schema=mongoose.schema;
// const userschema=new schema({
//     email:{
//         type:"string",
//         required:true,
//         unique:true
//     },
//     password:{
//         type:"string",
//         required:true
//     }
// })
// module.export=user=mongoose.model("user",userschema);
const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const bcrypt = require("bcrypt");
// const SALT_WORK_FACTOR = 10;
const userSchema= new Schema({
    // userName:{
    //     type:String,
    //     required:true
    // },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
})
// userSchema.pre("save",function(next){
//     let user=this;
//     if (!user.isModified("password"))return next();
//     bcrypt.genSalt(SALT_WORK_FACTOR,(err,salt)=>{
//         if (err) return next(err);
//         bcrypt.hash(user.password,salt,(err,hash)=>{
//             if(err) return next(err);
//                 user.password=hash;
//                 next();
//         })
//     })
// })
module.exports = User = mongoose.model('User', userSchema)
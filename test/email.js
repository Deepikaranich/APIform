const express = require("express");
const app = express();
const SendMail=(x,y)=>{
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: 'testmycode143@gmail.com',
    pass: 'mlbxbugqnogcnsdx'
  }
});
var mailOptions = {
  from: 'testmycode143@gmail.com',
  to: y,
  subject: "ur reset link",
  text:x,
};
transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
  
}
module.exports=SendMail;
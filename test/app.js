
const { v4: uuidv4 } = require("uuid");
let mail=require('./email')

require("dotenv").config();
const express=require('express')
const app=express()
var nodemailer = require('nodemailer');
const bcrypt = require("bcrypt");
const User=require('./test');
const Token=require('./token')
const bodyParser = require('body-parser');
const cors=require('cors');
const secretkey="fdoidgjoajgohriodf"
// const secretkey=process.env.SECRET_KEY;
const mongoString = process.env.DATABASE_URL;
console.log(mongoString)
const jwt= require("jsonwebtoken")
const mongoose = require('mongoose');
mongoose.connect(mongoString);
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'testmycode143@gmail.com',
      pass: 'mlbxbugqnogcnsdx'
    }
  });
  
//   var mailOptions = {
//     from: 'testmycode143@gmail.com',
//     to: '18nm1a0441@gmail.com',
//     subject: 'Sending Email using Node.js',
//     text: 'Hello Deepika!'
//   };
const database = mongoose.connection;
database.on("error", (error)=>{console.log(error)})
database.once("connected", ()=>{console.log("database connected")})
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors({
    origin:'http://localhost:3000'
}));
// const books = [
//     {title: 'Harry Potter', id: 1},
//     {title: 'Twilight', id: 2},
//     {title: 'Lorien Legacies', id: 3}
//     ]
//     app.get('/books', (req,res)=> {
//         res.send(books);
//         });
//         app.get('/books/:id', (req, res) => {
//             const book = books.find(c => c.id === parseInt(req.params.id));
           
             
//             if (!book) res.status(404).send('ERROR');
//             res.send(book);
//             });
//             app.post('/books', (req, res)=> {
//                 const book = {
//                 id: req.body.id,
//                 title: req.body.title
//                 };
//                 books.push(book);
//                 res.send(book);
//                 });
//                 app.put('/books/:id', (req, res) => {
//                     const book = books.find(c=> c.id === parseInt(req.params.id));
//                     book.title = req.body.title;
//                     res.send(book);
//                     });

//                 app.delete('/books/:id',(req,res)=>{
//                     const book = books.find(c=> c.id === parseInt(req.params.id));
//                     const index = books.indexOf(book);
//                     books.splice(index,1);
//                     res.send(books);
//                 })
              
app.post('/register' , (req,res)=>{
    // console.log(req.body)
    User.findOne({
        email: req.body.email
    }).then ((user)=>{
       
            if(user){
                res.json({
                    code:400,
                    msg:"email already exist"
                })
                // return res.status(400).json({email:"user has already registered",code:400})
                
            } else{
                const newUser = new User({
                    userName : req.body.userName,
                    email: req.body.email,
                    password: req.body.password,
                });
                var mailOptions = {
                    from: 'testmycode143@gmail.com',
                    to: req.body.email,
                    subject: 'THANK YOU FOR REGISTERING',
                    text: 'Hello thankyou for registering .We hope you will have a wonderful experience'
                  };
                  transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                      console.log(error);
                    } else {
                      console.log('Email sent: ' + info.response);
                    }
                  });
                // console.log(newUser)
                newUser.save()
                return res.status(200).json({msg: newUser});
               
            }

        
        // catch(err){
        //     res.json({})

        // }
       
    });
});
app.post("/forgetpassword",async(req,res)=>{
    let email=req.body.email
    try{.
        let users=await User.findOne({email : email})
        if(users){
            // res.send("email is present")
        }
        else{
            res.json({status:200,data:"mail is not registered"})
        }

    }
    catch(error){
        res.send(error)
     }
    
})

app.post('/login',async (req,res)=>{
    username = req.body.username,
  email =req.body.email,
  password= req.body.password
try{
  let users=await User.findOne({email : email})
  if(users){
     if(users && users._id){
         bcrypt.compare(password,users.password, (err,response)=>{

                 if(response){
                   const authToken=  jwt.sign({
                         _id: users._id},secretkey,
                         {expiresIn:'1h'}
                         )
                         res.json({status:200,token:authToken,data:"you have logged in",islogged:true})
                     } else if(!response){
                         res.json({status:200,data:"password is incorrect",islog:false})
                     }                    
         })
        }
  }
  else{
    res.json({status:200,data:"mail is not registered"})
  }
 }catch(error){
     res.send(error)
  }

})
app.post("/changepassword", async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;
      const authHeader = req.headers.authorization;
      const bearerToken = authHeader.split(" ");
      const token = bearerToken[1];
      if (!token) {
        return res.status(401).json("Unauthorized Token");
      }
      const decodeToken = jwt.verify(token,secretkey);
      const userId = decodeToken.id;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json("User Not found");
      }
      const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isOldPasswordValid) {
        return res.status(404).json("Invalid Password");
      }
      user.password = newPassword;
      await user.save();
      return res.json("Password Updated Successfully");
    } catch (error) {
      console.log(error);
      res.status(500).json("Internal Server Error");
    }
  });
  app.post("/resetlink", async (req, res) => {
    const {email} = req.body;
    // console.log(req.body.email);
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(404).json("User Not found");
      }
      const token = uuidv4();
      user.resetToken = token;
      user.resetTokenTime = Date.now() + 15 * 60 * 1000;
      await user.save();
      const resetlink = `http://localhost:2038/resetpassword/${user._id}/${token}`
      console.log(resetlink)
      return res.status(200).json('Reset password link sent to your email successfully')
    } catch (error) {
      console.log(error)
      return res.status(500).json('Internal Server Error')
    }
  });
const port = 8080;
app.listen(port,()=>{
    console.log(`app is listening on port ${port}`)
});
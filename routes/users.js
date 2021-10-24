
const router = require('express').Router();

const bcrypt = require('bcrypt');
const authMiddleware = require('../middlewares/authMiddleware');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const sendVerificationEmail = require('../utils/sendEmail');
const path = require("path")




const saltRounds = 10;


router.post('/create',async (req, res) => {
    const hash = await bcrypt.hash(req.body.password, saltRounds)
    const {fullName , email , birthdate , profilePic , covPic , gender } = req.body

    const searchUser = await User.findOne({email})
    if (searchUser) return res.status(400).send({message : "User already exist"})
    
    try {
      const userCreated = await User.create({
        fullName,
        email,
        password: hash,
        birthdate,
        profilePic,
        covPic,
        gender
    })

    const {password , ...data} = userCreated._doc;
    const token = jwt.sign({ data }, process.env.JWT_PASS , { expiresIn: 60 * 60 * 24 });
    res.status(201).send({user : userCreated , token });

    } catch (error) {
      res.status(400).send({error})
    }
  })


  router.get('/:id',authMiddleware , async (req, res) => {
    try {
      const user = await User.findById(req.params.id)
      if(!user) return res.status(404).send({message : "User not found id"})
      user.password = undefined
      res.send(user)
      
    } catch (error) {
      res.status(400).send(error)
      
    }
    });

    router.get('/' , async (req, res) => {
        const users = await User.find({})
        res.send(users)
      });


    router.delete('/:id',authMiddleware , async (req, res) => {
        const user = await User.findByIdAndDelete(req.params.id)
        if(!user) return res.status(404).send({message : "User not found"})
        res.send({message :"User successfuly deleted" })
       
      });


      router.delete('/',authMiddleware , async (req, res) => {
        await User.deleteMany({})
        res.send({message :"All Users successfuly deleted" })
       
      });



      router.post('/login',async (req, res) => {
        const user = await User.findOne({email : req.body.email})
        if(!user) return res.status(404).send({message : "User not found mail"})
    
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if(!validPassword) return res.status(404).send({message : "Incorrect password"})

        const {password , ...data} = user._doc;
        const token = jwt.sign({ data }, process.env.JWT_PASS , { expiresIn: 60 * 60 * 24 });
        res.status(200).send({user : data , token})
      })


      router.post('/verifyEmail/send',authMiddleware,async (req, res) => {
        console.log("verify" , req.user)
        const user = await User.findById(req.user._id)

        if (user.verifiedEmail){
          return res.status(400).send({message : "Mail already verified"})
        }
        
        if(!user.emailVerificationCode){
          const code = mongoose.mongo.ObjectId()
          user.emailVerificationCode = code
           await user.save()
        }

        if(process.env.NODE_ENV != "test"){
          sendVerificationEmail(user.email , user.emailVerificationCode)
        }

       res.status(200).send({message : "Email sent"})
      })

      router.post('/verifyEmail/verify',authMiddleware,async (req, res) => {

        const code = req.body.code

        console.warn("code " , code)

        const currentUser = await User.findOne({_id : req.user._id , emailVerificationCode : code})
        if(!currentUser) return res.status(400).send({message : "user with this code not found"})

        if(currentUser.verifiedEmail) return res.status(400).send({message : "Email already verified"})

        currentUser.verifiedEmail = true
        currentUser.save()


        console.log("code ", code)

        const token = jwt.sign({ data }, process.env.JWT_PASS , { expiresIn: 60 * 60 * 24 });

        res.status(200).send({message : "Email verified" , token})
       })

       router.post("/upload/:type",authMiddleware , async (req, res) => {
         const type = req.params.type

        if(!type === "covPic" || !type === "profilePic")
        return res.status(400).send({message : "send correct type "})

        const user = await User.findById(req.user._id)
        if(!user) res.status(400).send({message : "User not found"})


        const newpath =  path.resolve() + "/files/";
        const file = req.files.file;
        const filename = file.name;


        console.log(req.body)
        console.log(req.files)


      
        file.mv(`${newpath}${filename}`, async (err) => {
          if (err) {
            console.log(err)
            return res.status(500).send({ message: "File upload failed", code: 200 });
          }

          try {
            user[type] = `${filename}`
            await user.save()
            const {password , ...data} = user._doc;
            const token = jwt.sign({ data }, process.env.JWT_PASS , { expiresIn: 60 * 60 * 24 });
            return res.status(200).send({ message: "File Uploaded", code: 200 , token });

          } catch (error) {
            return res.status(500).send(error)
          }
          
        });


      });



module.exports = router;
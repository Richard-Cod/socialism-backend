
const router = require('express').Router();

const bcrypt = require('bcrypt');
const authMiddleware = require('../middlewares/authMiddleware');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const saltRounds = 10;

router.post('/create',async (req, res) => {
    const hash = await bcrypt.hash(req.body.password, saltRounds)
    try {
      const userCreated = await User.create({
        email : req.body.email,
        password: hash,
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
      try {
        const users = await User.find({})
        res.send(users)
        
      } catch (error) {
        res.status(400).send(error)
        
      }
      });


    router.delete('/:id',authMiddleware , async (req, res) => {
        const user = await User.findByIdAndDelete(req.params.id)
        if(!user) return res.status(404).send({message : "User not found"})
        res.send({message :"User successfuly deleted" })
       
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
       res.status(200).send({message : "Email sent"})
      })

      router.post('/verifyEmail/verify',authMiddleware,async (req, res) => {
        res.status(200).send("Check your mails")
       })

module.exports = router;
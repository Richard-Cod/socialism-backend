
const router = require('express').Router();

const bcrypt = require('bcrypt');
const authMiddleware = require('../middlewares/authMiddleware');
const User = require('../models/User');
const saltRounds = 10;

router.post('/create',async (req, res) => {
    const hash = await bcrypt.hash(req.body.password, saltRounds)
    try {
      const userCreated = await User.create({
        email : req.body.email,
        password: hash
    })
    res.send(userCreated);

    } catch (error) {
      res.send({error})
    }
  })


  router.get('/:email',authMiddleware , async (req, res) => {
    const user = await User.findOne({email : req.params.email})
    if(!user) res.status(404).send({message : "User not found mail"})
    user.password = undefined
    res.send(user)
    });





    router.delete('/:id',authMiddleware , async (req, res) => {
      try {
        const user = await User.findByIdAndDelete(req.params.id)
        if(!user) return res.status(404).send({message : "User not found"})
        res.send({message :"User successfuly deleted" })
        } catch (error) {
          res.send(error)
        }
      });



      router.post('/login',async (req, res) => {
        const user = await User.findOne({email : req.body.email})
        if(!user) return res.status(404).send({message : "User not found mail"})
    
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        console.log(validPassword)
        
        const {password , ...data} = user._doc;
        const token = jwt.sign({ data }, process.env.JWT_PASS , { expiresIn: 60 * 60 * 24 });
        res.send({user : data , token})
      })

module.exports = router;
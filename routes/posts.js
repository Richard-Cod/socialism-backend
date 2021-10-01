const router = require('express').Router();

const authMiddleware = require('../middlewares/authMiddleware');
const Post = require('../models/User');


router.post('/create',authMiddleware, async (req, res) => {
    try {
      const postCreated = await Post.create({
        createdBy : req.user._id,
        title: req.body.title,
        content: req.body.content,
    })
    res.send(postCreated);
  
    } catch (error) {
      res.status(500).send(error)
  
    }
  })

  

router.put('/:id',authMiddleware , async (req, res) => {
    try {
      const newData = req.body
      const post = await Pos.findByIdAndUpdate(req.params.id , newData)
  
      if(!post) return res.status(404).send({message : "Post not found"})
  
      res.send({message :"Post successfuly updated" })
    } catch (error) {
      res.status(500).send(error)
    }
    });
  
  
  
  router.delete('/:id',authMiddleware , async (req, res) => {
    try {
    const post = await Post.findByIdAndDelete(req.params.id)
    if(!post) return res.status(404).send({message : "Post not found"})
    res.send({message :"Post successfuly deleted" })
    } catch (error) {
      res.send(error)
    }
    });
  
  
    module.exports = router;

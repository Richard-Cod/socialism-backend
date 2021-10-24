const router = require('express').Router();

const authMiddleware = require('../middlewares/authMiddleware');
const Post = require('../models/Post');
const User = require('../models/User');
const path = require("path")


router.get('/',authMiddleware, async (req, res) => {
  try {
    posts = await Post.find({})

    res.status(201).send(posts);

  } catch (error) {
    res.status(500).send(error)

  }
})


// const friends = await Promise.all(
//   user.followings.map((friendId) => {
//     return User.findById(friendId);
//   })
// );



router.post('/create',authMiddleware, async (req, res) => {

  const newpath =  path.resolve() + "/files/";
  const postImages = []


  req.files.files.forEach(file => {
    const filename = file.name + new Date().getTime();
    postImages.push(filename)
    console.log(postImages)


    file.mv(`${newpath}${filename}`, async (err) => {
      if (err) {
        return res.status(500).send({ message: "File upload failed", code: 200 });
      }
    })
  });


  console.log(postImages)

    try {
      const postCreated = await Post.create({
        createdBy : req.user._id,
        title: req.body.title,
        content: req.body.content,
        images : postImages
    })
    res.status(201).send(postCreated);
  
    } catch (error) {
      res.status(500).send(error)
  
    }
  })

  

router.put('/update/:id',authMiddleware , async (req, res) => {
    try {
      const newData = req.body
      const post = await Post.findByIdAndUpdate(req.params.id , newData)
  
      if(!post) return res.status(404).send({message : "Post not found"})
  
      res.status(200).send({message :"Post successfuly updated" })
    } catch (error) {
      res.status(500).send(error)
    }
    });
  


    router.put('/like',authMiddleware , async (req, res) => {
      try {
        const likeurId = req.body.likeurId
        const postId = req.body.postId

        console.log(likeurId)
        console.log(postId)
        const user = await User.findById(likeurId)
        if(!user) return res.status(404).send({message : "Likeur not found"})


        const post = await Post.findById(postId)

        if(!post) return res.status(404).send({message : "Post not found"})
        
        post.likes.push({userId : likeurId})
        post.save()


        res.status(200).send({message :"Post successfuly liked" })
      } catch (error) {
        res.status(500).send(error)
      }
      });


      router.put('/dislike',authMiddleware , async (req, res) => {
        try {
          const likeurId = req.body.likeurId
          const postId = req.body.postId
  
          const user = await User.findById(likeurId)
          if(!user) return res.status(404).send({message : "DisLikeur not found"})
  
  
          const post = await Post.findById(postId)
          if(!post) return res.status(404).send({message : "Post not found"})
          

          await post.updateOne({ $pull: { likes : {userId : likeurId} } });

          
  
          res.status(200).send({message :"Post successfuly disliked" })
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
      res.status(500).send(error)
    }
    });


    router.delete('/',authMiddleware , async (req, res) => {
      try {
       await Post.deleteMany({})
      res.send({message :"All Posts successfuly deleted" })
      } catch (error) {
        res.status(500).send(error)
      }
      });
  
  
    module.exports = router;
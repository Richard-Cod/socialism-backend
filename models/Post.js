
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    createdBy: {
        type: String,
        required : true,
      },
      title: {
        type: String,
        required : true,
      },
    content: {
        type: String,
        required : true,
      },
      images: {
        type: Array,
        default: [],
      },
      likes: {
        type: Array,
        default: [],
      },
      comments: {
        type: Array,
        default: [],
      },

  }, {timestamps : true});
  
  const Post = mongoose.model('Post', postSchema);

  

  module.exports = Post
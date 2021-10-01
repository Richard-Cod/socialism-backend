
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
  }, {timestamps : true});
  
  const Post = mongoose.model('Post', postSchema);

  

  module.exports = Post
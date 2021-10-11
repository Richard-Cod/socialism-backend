
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required : true,
        lowercase: true ,
        unique : true,
      },
    password: {
        type: String,
        required : true,
      },
    
    verifiedEmail: {
      type: Boolean,
      default : false,
    },
  }, {timestamps : true});

const User = mongoose.model('User', userSchema);

module.exports = User

const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    fullName: {
      type: String,
      required : true,
    },
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
    birthdate: { type: Date },
    gender: {
      type: String,
      enum: ['Male', 'Female'],
    },
    
    profilePic: {
      type: String,
    },
    covPic: {
      type: String,
    },

    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },

    
    
    verifiedEmail: {
      type: Boolean,
      default : false,
    },
    emailVerificationCode : {
      type: String,
    },
  }, {timestamps : true});

const User = mongoose.model('User', userSchema);

module.exports = User
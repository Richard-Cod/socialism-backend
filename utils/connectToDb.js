const mongoose = require('mongoose');
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })
const url = process.env.MONGO_URL;

const connectToDB  = async() => {
    try {
     await mongoose.connect(url)
    } catch (error) {
      console.log(error)
    }
  }

module.exports = connectToDB
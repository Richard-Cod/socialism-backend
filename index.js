
const express = require('express')
const mongoose = require('mongoose');
const morgan = require("morgan")
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })

const app = express()
app.use(express.json())

// Activation du log des routes
app.use(morgan('tiny'))

// Variables d'environnement
// const host = process.env.API_HOST || '0.0.0.0'
// const port = process.env.PORT || 3000
// const url = process.env.MONGO_URL;

const host = process.env.API_HOST
const port = process.env.PORT
const url = process.env.MONGO_URL;


app.use('/users', require('./routes/users'));
app.use('/posts', require('./routes/posts'));


console.log(host)
console.log(port)
console.log(url)

app.listen(port, () => {
    console.log(`Running on http://${host}:${port} - Environnement : ${process.env.NODE_ENV}`)
  })

// mongoose.connect(url).then(() => {
   
// }).catch((e) => {
//     console.log(e)
// })


module.exports = app


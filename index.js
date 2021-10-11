
const express = require('express')
const morgan = require("morgan")
const connectToDB = require('./utils/connectToDb')
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })

const app = express()
app.use(express.json())

app.use(morgan('tiny'))

app.use(require("cors")())

const host = process.env.API_HOST
const port = process.env.PORT


app.use('/api/users', require('./routes/users'));
app.use('/api/posts', require('./routes/posts'));


connectToDB()

const server = app.listen(port, () => {
  process.env.NODE_ENV !== 'test' && console.log(`Running on http://${host}:${port} - Environnement : ${process.env.NODE_ENV}`)
    })

module.exports = server


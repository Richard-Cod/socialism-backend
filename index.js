
const express = require('express')
const mongoose = require('mongoose');

require('dotenv').config()

const app = express()
app.use(express.json())
const port = process.env.PORT || 3000
const url = process.env.MONGO_URL;


app.use('/users', require('./routes/users'));
app.use('/posts', require('./routes/posts'));


mongoose.connect(url).then(() => {
    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`)
      })
}).catch((e) => {
    console.log(e)
})





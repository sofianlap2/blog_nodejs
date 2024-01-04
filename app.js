const express = require('express');
const app = express()

const postRoutes = require('./Routes/postRoutes');
const authRoutes = require('./Routes/authRoutes');

app.use(express.json());

app.use('/posts', postRoutes)
app.use('/auth', authRoutes)


module.exports = app
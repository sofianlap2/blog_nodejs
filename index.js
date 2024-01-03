require('dotenv').config()
const port = process.env.PORT || 3000
const mongoose = require('mongoose')
const CustomError = require('./Utils/CustomError')
const globalErrorHandler = require('./Controllers/errorController')

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message)

  console.log('Uncaught Exception occuered! Server is shutting down');

  process.exit(1)
})

// Connection to mongoose
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
    console.log('app is connected successfully to mongoDB')
})

mongoose.connection.on('error', () => {
    console.log('error on connection to mongoDB')
})

// Routes login
const app = require('./app')

console.log("Server run on mode = " + process.env.NODE_ENV)

// Handling not found error
app.all('*', (req,res,next) => {
  // res.status(404).json({
  //   status: 'error',
  //   message: "This route does not exist"
  // })

  const error = new CustomError(`This route ${req.originalUrl} does not exist on the server`, 404)
  next(error)
})

// Global error handler
app.use(globalErrorHandler)

// SERVER PORT
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
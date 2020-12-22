const mongoose = require('mongoose')
const config = require('config')
const db = process.env.NODE_ENV ? process.env.mongoURI : config.get('mongoURI')

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
    console.log('Mongoose connected')
  } catch (e) {
    console.log(e.message)
    //Exit with failure
    process.exit(1)
  }
}

module.exports = connectDB

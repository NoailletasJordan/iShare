const mongoose = require('mongoose')
const db =
  'mongodb+srv://jo123:jo123@devconnector-z9ko7.mongodb.net/jest?retryWrites=true&w=majority'

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    })
    console.log('Mongoose connected')
  } catch (e) {
    console.log(e.message)
    //Exit with failure
    process.exit(1)
  }
}

module.exports = connectDB

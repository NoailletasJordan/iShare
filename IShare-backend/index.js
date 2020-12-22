var express = require('express')
const cors = require('cors')
const path = require('path')
var app = express()
const connectDB = require('./config/db')
const Users = require('./api/users')
const Auth = require('./api/auth')
const Posts = require('./api/posts')
const Profile = require('./api/profile')

const PORT = process.env.PORT || 5000
app.use(cors())

//Connect database
connectDB()

//init middleware
app.use(express.json())

// FIX EMPTY BODY -- no need to npm install
var bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

//Define route
app.use('/api/users', Users)
app.use('/api/posts', Posts)
app.use('/api/auth', Auth)
app.use('/api/profile', Profile)

console.log(process.env.NODE_ENV)

app.listen(PORT, () => console.log('server startend on port ' + PORT))

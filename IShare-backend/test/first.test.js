const request = require('supertest')
const express = require('express')

//req new database (without listening a port)
const jestDB = require('./jestDB')

//req routers
const Users = require('../api/users')
const Auth = require('../api/auth')
const Posts = require('../api/posts')
const Profile = require('../api/profile')

// get express api
const app = express()

//Connect API
app.use('/api/users', Users)
app.use('/api/posts', Posts)
app.use('/api/auth', Auth)
app.use('/api/profile', Profile)

//init middleware
app.use(express.json())

//Connect database
jestDB()

//data
const user1 = {
  name: 'eh',
  email: 'elefant@mail.com',
  password: '1234567'
}

const user2 = {
  name: 'deleteme',
  email: 'delete@mail.com',
  password: '1234567'
}

let theToken
afterAll(async () => {
  return await request(app)
    .delete('/api/profile')
    .set('x-auth-token', theToken)
    .expect(200)
})

//tests

/* test('add', async () => {
  await request(app)
    .post('/api/users')
    .send(user1)
    .expect(200)
}) */

test('should add a user ', async () => {
  //create the user
  const response = await request(app)
    .post('/api/users')
    .send(user2)
    .expect(200)

  // save the token for the after all
  theToken = response.body.token
})

/* test('delete a user', async () => {
  await request(app)
    .delete('api/profile')
    .set(
      'x-auth-token',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWUxOTExNDVjMzAyMzY0MmIwODE5YzRkIn0sImlhdCI6MTU3ODcwMTEyNX0.dK5bJqvQKU4qwd7KcT3_5-S39yw2OvUGr6rSb29VOFw'
    )
    .expect(200)
}) */

test('get all profiles', async () => {
  const response = await request(app)
    .get('/api/profile')
    .expect(200)
})

test('get all users', async () => {
  const response = await request(app)
    .get('/api/users')
    .expect(200)
})

test('login user', async () => {
  const response = await request(app)
    .post('/api/auth')
    .send({ email: 'elefant@mail.com', password: '1234567' })
    .expect(200)
})

/* test('get all posts', async () => {
  const response = await request(app)
    .get('/api/posts')
    .expect(200)
}) */

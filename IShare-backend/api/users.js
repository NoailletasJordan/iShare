const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')

const User = require('../models/User')

//@route    POST api/users
//@desc     register user
//@access   Public
router.post(
  '/',
  [
    check('email', 'please include a valid email').isEmail(),
    check(
      'password',
      'Please include a password with 6 or more caracters'
    ).isLength({ min: 6 }),
    check('name', 'Name is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      //console.log({ errors: errors.array() })
      console.log(req.body)
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password } = req.body

    try {
      //see if user exists
      let user = await User.findOne({ email })
      if (user) {
        return res
          .status(402)
          .json({ errors: [{ msg: 'This email is already taken' }] })
      }

      //get users gravatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      })

      user = new User({
        name,
        email,
        avatar,
        password,
      })

      //encrypt password
      const salt = await bcrypt.genSalt(8)
      user.password = await bcrypt.hash(password, salt)

      //return jsonwebtoken
      const payload = {
        user: {
          id: user.id,
        },
      }

      jwt.sign(
        payload,
        process.env.NODE_ENV ? process.env.jwtSecret : config.get('jwtSecret'),
        (err, token) => {
          if (err) throw err
          res.json({ token })
        }
      )

      await user.save()
    } catch (e) {
      console.error({ errors: [{ msg: 'serveur error : ' + e.message }] })
      res
        .status(500)
        .send({ errors: [{ msg: 'serveur error : ' + e.message }] })
    }
  }
)

//@route    GET api/users
//@desc     get all users
//@access   Public
router.get('/', async (req, res) => {
  try {
    const users = await User.find()
    res.send(users)
  } catch (e) {
    console.error({ errors: [{ msg: 'serveur error : ' + e.message }] })
    res.status(500).send({ errors: [{ msg: 'serveur error : ' + e.message }] })
  }
})

//@route    GET api/users/google
//@desc     get googleId
//@access   Public
router.get('/google', async (req, res) => {
  try {
    res.json({
      googleClientId: process.env.NODE_ENV
        ? process.env.googleClientId
        : config.get('googleClientId'),
    })
  } catch (e) {
    console.error({ errors: [{ msg: 'serveur error : ' + e.message }] })
    res.status(500).send({ errors: [{ msg: 'serveur error : ' + e.message }] })
  }
})

//@route    POST api/users/google
//@desc     register user with google
//@access   Public
router.post(
  '/google',
  [
    check('email', 'please include a valid email').isEmail(),
    check(
      'password',
      'Please include a password with 6 or more caracters'
    ).isLength({ min: 6 }),
    check('name', 'Name is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password, avatar } = req.body

    try {
      //see if user exists
      let user = await User.findOne({ email })
      if (user) {
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
          return res.status(400).json({
            errors: [{ msg: 'Error you likely registered without google' }],
          })
        }
        console.log('isMatch')

        //return jsonwebtoken
        const payload = {
          user: {
            id: user.id,
          },
        }

        jwt.sign(
          payload,
          process.env.NODE_ENV
            ? process.env.jwtSecret
            : config.get('jwtSecret'),
          (err, token) => {
            if (err) throw err
            res.json({ token })
          }
        )
        return
      }
      console.log('fin exist')
      //if user dont exist
      user = new User({
        name,
        email,
        avatar,
        isGoogle: true,
        password,
      })

      //encrypt password
      const salt = await bcrypt.genSalt(8)
      user.password = await bcrypt.hash(password, salt)

      //return jsonwebtoken
      const payload = {
        user: {
          id: user.id,
        },
      }

      jwt.sign(
        payload,
        process.env.NODE_ENV ? process.env.jwtSecret : config.get('jwtSecret'),
        (err, token) => {
          if (err) throw err
          res.json({ token })
        }
      )

      await user.save()
      console.log('fin finale')
    } catch (e) {
      console.error({ errors: [{ msg: 'serveur error : ' + e.message }] })
      res
        .status(500)
        .send({ errors: [{ msg: 'serveur error : ' + e.message }] })
    }
  }
)

module.exports = router

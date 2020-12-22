const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const User = require('../models/User')
const { check, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const config = require('config')
const bcrypt = require('bcryptjs')

//@route    GET api/auth
//@desc     get user profile
//@access   Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    if (!user)
      return res.status(404).send({ errors: [{ msg: 'User not found' }] })
    return res.json(user)
  } catch (e) {
    console.log({ errors: [{ msg: 'serveur error : ' + e.message }] })
    return res
      .status(500)
      .send({ errors: [{ msg: 'serveur error : ' + e.message }] })
  }
})

//@route    POST api/auth
//@desc     login user
//@access   Public
router.post(
  '/',
  [
    check('email', 'please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body

    try {
      //find user with email and compare passwd
      let user = await User.findOne({ email })
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] })
      }

      const isMatch = await bcrypt.compare(password, user.password)

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] })
      }

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
    } catch (e) {
      console.error(e.message)
      res
        .status(500)
        .send({ errors: [{ msg: 'serveur error : ' + e.message }] })
    }
  }
)

module.exports = router

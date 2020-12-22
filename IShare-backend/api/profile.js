const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const Profile = require('../models/Profile')
const User = require('../models/User')
const { check, validationResult } = require('express-validator')
const request = require('request')
const config = require('config')

//@route    GET api/profile/me
//@desc     get current user profile
//@access   Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['name', 'avatar'])
    if (!profile)
      return res
        .status(404)
        .json({ errors: [{ msg: 'There is no profile for this user' }] })
    res.json(profile)
  } catch (e) {
    console.log(e.message)
    res.status(500).send({ errors: [{ msg: 'serveur error : ' + e.message }] })
  }
})

//@route    Post api/profile
//@desc     create or update user profile
//@access   Private
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required').not().isEmpty(),
      check('skills', 'Skills is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() })

    try {
      // build profile object
      console.log(req.body)
      const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        twitter,
        facebook,
        instagram,
        linkedin,
      } = req.body

      const profileFields = {}
      profileFields.user = req.user.id
      if (company) profileFields.company = company
      if (website) profileFields.website = website
      if (location) profileFields.location = location
      if (bio) profileFields.bio = bio
      if (status) profileFields.status = status
      if (githubusername) profileFields.githubusername = githubusername
      if (skills) {
        profileFields.skills = skills.split(',').map((skill) => skill.trim())
      }

      //build social object
      profileFields.social = {}
      if (youtube) profileFields.social.youtube = youtube
      if (twitter) profileFields.social.twitter = twitter
      if (facebook) profileFields.social.facebook = facebook
      if (linkedin) profileFields.social.linkedin = linkedin
      if (instagram) profileFields.social.instagram = instagram

      let profile = await Profile.findOne({ user: req.user.id })

      if (profile) {
        //update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        )

        return res.json(profile)
      }

      //create
      profile = new Profile(profileFields)
      await profile.save()
      console.log(profile.location)
      res.send(profile)
    } catch (e) {
      console.log(e.message)
      res
        .status(500)
        .send({ errors: [{ msg: 'serveur error : ' + e.message }] })
    }
  }
)

//@route    GET api/profile
//@desc     get all profiles with avatars and name
//@access   Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find()
    const users = await User.find()

    //grab avatar and name of each profile from the according user
    const completeProfiles = profiles.map((profile) => {
      const user = users.find(
        (user) => user._id.toString() === profile.user.toString()
      )
      return {
        ...profile._doc,
        avatar: user.avatar,
        name: user.name,
      }
    })

    return res.send(completeProfiles)
  } catch (e) {
    console.log(e.message)
    res.status(500).send({ errors: [{ msg: 'serveur error : ' + e.message }] })
  }
})

//@route    GET api/profile/user/:user_id
//@desc     get profile by user Id
//@access   Public
router.get('/user/:user_id', async (req, res) => {
  try {
    //grab the name and avatar of the user
    const user = await User.findById(req.params.user_id)
    if (!user)
      return res.status(404).send({ errors: [{ msg: 'User not found' }] })

    const profile = await Profile.findOne({ user: req.params.user_id })

    if (!profile)
      return res.status(404).send({ errors: [{ msg: 'Profile not found' }] })

    profile._doc.name = user.name
    profile._doc.avatar = user.avatar
    res.json(profile)
  } catch (e) {
    console.log(e.message)
    if (e.kind === 'ObjectId')
      res.status(404).send({ errors: [{ msg: 'Profile not found' }] })
    res.status(500).send('error with the server')
  }
})

//@route    DELETE api/profile/
//@desc     Delete profile,user & posts
//@access   Private
router.delete('/', auth, async (req, res) => {
  try {
    //remove posts

    //remove profile
    const profiles = await Profile.findOneAndRemove({ user: req.user.id })
    //remove user
    await User.findOneAndRemove({ _id: req.user.id })
    //success
    res.send({ msg: 'user removed' })
  } catch (e) {
    console.log(e.message)
    res.status(500).send({ errors: [{ msg: 'serveur error : ' + e.message }] })
  }
})

//@route    PUT api/profile/experience
//@desc     Add profile experience
//@access   Private
router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('company', 'Company is required').not().isEmpty(),
      check('from', 'From date is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    } = req.body

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    }

    try {
      const profile = await Profile.findOne({ user: req.user.id })
      profile.experience.unshift(newExp)
      await profile.save()
      res.send(profile)
    } catch (e) {
      console.log(e.message)
      res
        .status(500)
        .send({ errors: [{ msg: 'serveur error : ' + e.message }] })
    }
  }
)

//@route    DELETE api/profile/experience/:exp_id
//@desc     Delete an experience
//@access   Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })
    if (!profile) throw new Error('profile not found')
    const newExpArr = profile.experience.filter(
      (elt) => elt.id !== req.params.exp_id
    )
    if (newExpArr.length === profile.experience.length)
      throw new Error('Experience not found')
    profile.experience = newExpArr
    await profile.save()
    res.send(profile)
  } catch (e) {
    console.log(e.message)
    res.status(500).send({ errors: [{ msg: 'serveur error : ' + e.message }] })
  }
})

//@route    PUT api/profile/education
//@desc     add an education
//@access   Private
router.put(
  '/education',
  [
    auth,
    [
      check('school', 'School is required').not().isEmpty(),
      check('degree', 'Degree is required').not().isEmpty(),
      check('fieldofstudy', 'Field of study is required').not().isEmpty(),
      check('from', 'From date is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    } = req.body

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    }

    try {
      const profile = await Profile.findOne({ user: req.user.id })
      profile.education.unshift(newEdu)
      await profile.save()
      res.send(profile)
    } catch (e) {
      console.log(e.message)
      res
        .status(500)
        .send({ errors: [{ msg: 'serveur error : ' + e.message }] })
    }
  }
)

//@route    DELETE api/profile/education/:exp_id
//@desc     Delete an education
//@access   Private
router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })
    if (!profile) throw new Error('profile not found')
    const newEduArr = profile.education.filter(
      (elt) => elt.id !== req.params.edu_id
    )
    if (newEduArr.length === profile.education.length)
      throw new Error('Education not found')
    profile.education = newEduArr
    await profile.save()
    res.send(profile)
  } catch (e) {
    console.log({ errors: [{ msg: 'serveur error : ' + e.message }] })
    res.status(500).send({ errors: [{ msg: 'serveur error : ' + e.message }] })
  }
})

//@route    GET api/profile/github/:username
//@desc     get user repo from github
//@access   Public

router.get('/github/:username', async (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${
        process.env.NODE_ENV
          ? process.env.githubClientId
          : config.get('githubClientId')
      }&client_secret=${
        process.env.NODE_ENV
          ? process.env.githubSecret
          : config.get('githubSecret')
      }`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' },
    }

    request(options, (err, response, body) => {
      if (err) return console.log(error)

      if (response.statusCode !== 200)
        return res.status(404).json({ msg: 'not github found' })

      res.json(JSON.parse(body))
    })
  } catch (e) {
    console.log({ errors: [{ msg: 'serveur error : ' + e.message }] })
    res.status(500).send({ errors: [{ msg: 'serveur error : ' + e.message }] })
  }
})

module.exports = router

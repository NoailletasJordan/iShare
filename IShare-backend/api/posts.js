const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const auth = require('../middleware/auth')
const Post = require('../models/Post')
const User = require('../models/User')

//@route    POST /api/posts
//@desc     Create a post
//@access   Private
router.post(
  '/',
  [
    auth,
    [
      check('text', 'Text is required').not().isEmpty(),
      check('title', 'Title is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.json({ errors: errors.array() })

    const user = await User.findById(req.user.id).select('-password')

    try {
      const newPost = {
        title: req.body.title,
        text: req.body.text,
        user: user.id,
        name: user.name,
        avatar: user.avatar,
      }

      const post = new Post(newPost)

      await post.save()

      res.json(post)
    } catch (e) {
      console.log({ errors: [{ msg: 'serveur error : ' + e.message }] })
      res
        .status(500)
        .send({ errors: [{ msg: 'serveur error : ' + e.message }] })
    }
  }
)

//@route    GET /api/posts
//@desc     get all posts
//@access   Public
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 })
    res.json(posts)
  } catch (e) {
    console.log(e.message)
    res.status(500).send({ errors: [{ msg: 'serveur error : ' + e.message }] })
  }
})

//@route    GET /api/posts/:post_id
//@desc     get a posts by id
//@access   Public
router.get('/:post_id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id)
    if (!post)
      return res.status(404).send({ errors: [{ msg: 'Post not found ' }] })
    res.json(post)
  } catch (e) {
    console.log(e.message)
    if (e.kind === 'ObjectId')
      return res.status(404).send({ errors: [{ msg: 'Post not found ' }] })
    res.status(500).send({ errors: [{ msg: 'serveur error : ' + e.message }] })
  }
})

//@route    DELETE /api/posts/:post_id
//@desc     delete a posts by id
//@access   Private
router.delete('/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id)
    if (!post)
      return res.status(404).send({ errors: [{ msg: 'Post not found ' }] })
    console.log(req.user.id, post.user)
    if (req.user.id.toString() !== post.user.toString())
      return res.status(400).send({
        errors: [{ msg: 'Unauthorized: Only the author can delete a post' }],
      })

    await Post.findByIdAndRemove(req.params.post_id)
    res.json('post removed')
  } catch (e) {
    console.log(e.message)
    if (e.kind === 'ObjectId')
      return res.status(404).send({ errors: [{ msg: 'Post not found ' }] })
    res.status(500).send({ errors: [{ msg: 'serveur error : ' + e.message }] })
  }
})

//@route    PUT /api/posts/like/:post_id
//@desc     like a post
//@access   Private
router.put('/like/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id)
    //check if post already liked
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    )
      return res.status(400).json({ errors: [{ msg: 'Post Already liked' }] })

    post.likes.unshift({ user: req.user.id })

    await post.save()

    res.json(post.likes)
  } catch (e) {
    console.log(e.message)
    res.status(500).send({ errors: [{ msg: 'serveur error : ' + e.message }] })
  }
})

//@route    PUT /api/posts/unlike/:post_id
//@desc     unlike a post
//@access   Private
// !!! not used !!!
router.put('/unlike/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id)

    const newLikeArr = post.likes.filter(
      (like) => like.user.toString() !== req.user.id
    )

    //check if post already liked
    if (newLikeArr.length === post.likes.length)
      return res
        .status(400)
        .json({ errors: [{ msg: 'Post not yet been liked' }] })

    post.likes = newLikeArr
    await post.save()

    res.json(post.likes)
  } catch (e) {
    console.log(e.message)
    res.status(500).send({ errors: [{ msg: 'serveur error : ' + e.message }] })
  }
})

//@route    POST /api/posts/comment/:post_id
//@desc     comment on a post
//@access   Private
router.post(
  '/comment/:post_id',
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.json({ errors: errors.array() })

    try {
      const user = await User.findById(req.user.id).select('-password')
      const post = await Post.findById(req.params.post_id)

      const newComment = {
        text: req.body.text,
        user: user.id,
        name: user.name,
        avatar: user.avatar,
      }

      post.comments.unshift(newComment)

      await post.save()

      res.json(post.comments)
    } catch (e) {
      console.log(e.message)
      res
        .status(500)
        .send({ errors: [{ msg: 'serveur error : ' + e.message }] })
    }
  }
)

//@route    DELETE /api/posts/comment/:post_id/:com_id
//@desc     delete a comment
//@access   Private
router.delete('/comment/:post_id/:com_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id)
    const user = await User.findById(req.user.id)

    // pull out the comment
    const comment = post.comments.find(
      (comment) => comment.id === req.params.com_id
    )

    // check if the comment exist
    if (!comment)
      return res.status(404).json({ errors: [{ msg: 'Comment not found' }] })

    //check if it is the author
    if (comment.user.toString() !== user.id.toString())
      return res.status(400).send({
        errors: [{ msg: 'Unauthorized: Only the author can delete a comment' }],
      })

    const newCommentsArr = post.comments.filter(
      (com) => com.id !== req.params.com_id
    )

    post.comments = newCommentsArr
    post.save()
    res.json(post.comments)
  } catch (e) {
    console.log(e.message)
    if (e.kind === 'ObjectId')
      return res.status(404).send({ errors: [{ msg: 'Comment not found' }] })
    res.status(500).send({ errors: [{ msg: 'serveur error : ' + e.message }] })
  }
})

module.exports = router

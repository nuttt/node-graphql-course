const express = require('express')
const router = express.Router()
const _ = require('lodash')

const User = require('../models/User')
const Post = require('../models/Post')
const Comment = require('../models/Comment')

router.get('/', async (req, res) => {
  const posts = await Post.list()
  posts.forEach(async (post) => {
    post.user = await User.get(post.userId)
  })
  res.status(200).json(posts)
})

router.get('/user/:userId', async (req, res) => {
  const posts = await Post.listByUser(req.params.userId)
  posts.forEach(async (post) => {
    post.user = await User.get(post.userId)
  })
  res.status(200).json(posts)
})

router.get('/:id', async (req, res) => {
  const post = await Post.get(req.params.id)
  post.user = await User.get(post.userId)
  post.comments = await Comment.listByPost(post.id)
  post.comments.forEach(async (comment) => {
    comment.user = await User.get(comment.userId)
  })
  res.status(200).json(post)
})

// TODO: Add auth middleware
router.post('/', async (req, res) => {

})

// TODO: Add auth middleware
router.post('/:id/comment', async (req, res) => {

})

module.exports = router

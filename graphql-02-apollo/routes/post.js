const express = require('express')
const router = express.Router()
const _ = require('lodash')

const User = require('../models/User')
const Post = require('../models/Post')
const Comment = require('../models/Comment')

const checkAuthMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.sendStatus(401)
  }
  next()
}

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
  if (!post) {
    return res.sendStatus(404)
  }
  post.user = await User.get(post.userId)
  post.comments = await Comment.listByPost(post.id)
  post.comments.forEach(async (comment) => {
    comment.user = await User.get(comment.userId)
  })
  res.status(200).json(post)
})

// TODO: Add auth middleware
router.post('/', checkAuthMiddleware, async (req, res) => {
  const post = await Post.create(req.user.id, req.body.title, req.body.content)
  res.status(200).json(post)
})

// TODO: Add auth middleware
router.post('/:id/comment', checkAuthMiddleware, async (req, res) => {
  const post = await Post.get(req.params.id)
  if (!post) {
    return res.sendStatus(400)
  }
  const comment = await Comment.create(req.user.id, post.id, req.body.content)
  res.status(200).json(comment)
})

module.exports = router

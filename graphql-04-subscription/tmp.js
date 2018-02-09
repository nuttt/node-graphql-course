const Post = require('./models/Post')
const Comment = require('./models/Comment')
;(async () => {
  // await Comment.create(4, 1, 'comment 1')
  // await Comment.create(5, 1, 'comment 2')
  // await Comment.create(4, 2, 'comment 3')
  // await Comment.create(5, 2, 'comment 4')
  console.log(await Comment.listByPost(1))
})()

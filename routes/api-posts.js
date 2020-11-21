const express = require('express');
//const db = require('../models');
const router = express.Router();
const models = require('../models');

// Get All posts (BROWSE)
// GET /api/v1/posts/
router.get('/', function(req, res) {
  models.Post.findAll()
    .then(post => {
      res.json(post)
    })
});

// Get 1 Post by ID (READ 1 POST)
// GET /api/v1/posts/102
router.get('/:id', (req, res) => {
  models.Post.findByPk(req.params.id)
    .then((post) => {
      if (post) {
        res.json(post)
      } else {
        res.status(404).json({
          error: 'Post not found'
        })
      }
    })
})

//update post (EDIT)
// PUT /api/v1/post/101
router.put('/:id', (req, res) => {

  if (!req.body || !req.body.author || !req.body.title || !req.body.content || !req.body.published) {
    res.status(400).json({
      eror: 'Please submit all required fields'
    })
    return;
  }
  models.Post.update({
    author: req.body.author,
    title: req.body.title,
    content: req.body.content,
    published: req.body.published,
  }, {
    where: {
      id: req.params.id
    }
  })
    .then(updated => {
//      if (update && update[0] === 1) {
        if (update && update[0] >0) {
        res.status(202).json({
          success: 'Post Updated'
        });
      } else {
        res.status(404).json({
          error: 'Post not found'
        })
      }
    })
})

// create new post (ADD)
// POST /api/vi/posts/
router.post('/', (req, res) => {
  if (!req.body || !req.body.author || !req.body.title || !req.body.content || !req.body.published) {
    res.status(400).json({
      eror: 'Please submit all required fields'
    })
    return;
  }
  models.Post.create({
    author: req.body.author,
    title: req.body.title,
    content: req.body.content,
    published: req.body.published,
  })
    .then(post => {
      res.status(201).json(post)
    })
})

// delete post (DELETE)
//DELETE /api/v1/posts/101
router.delete('/:id', (req, res) => {
  models.Post.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(deleted => {
      if (deleted === 1) {
        res.status(202).json({
          success: 'Post deleted'
        });
      } else {
        res.status(404).json({
          error: 'Post not found'
        });

      }
    })

})

// GET /api/v1/posts/102/comments
router.get('/:postId/comments', (res, req) => {
  db.Comment.findAll({
    where: {
      PostId: req.parmas.postId
    }
  })
  .then(comments => {
    res.json(comments)
  })
})

// example URL:
// POST /api/v1/posts/102/comments
router.post('/:postId/comments', (req, res) => {
  if (!req.body || !req.body.author || !req.body.content) {
    res.status(400).json({
      error: 'Please include all required fields'
    })
    return;
  }

  models.Post.findByPk(req.params.postId)
    .then(post => {
      if (!post) {
        res.status(404).json({
          error: "Can't create comment for post that doesn't exist"
        })
      }
      return post.createComment({
        author: req.body.author,
        content: req.body.content,
        approved: true
      });
    })
    .then(comment => {
      res.json({
        success: 'Comment added',
        comment: comment
      })
    })
});

module.exports = router;
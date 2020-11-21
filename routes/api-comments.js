const express = require('express');
const router = express.Router();
const models = require('../models');

// PUT /api/v1/comments/1212
router.put('/:commentId', (req, res) => {
    if (!req.body || !req.body.author || !req.body.content || (!req.body.approved && req.body.approved !== false)) {
        res.status(400).json({
            error: 'Please submit all required fields'
        })
        return;
    }

    models.Comment.update({
        author: req.body.author,
        content: req.body.content,
        approved: req.body.approved !== 'false' && req.body.approved !== false ? true : false
    }, {
        where: {
            id: req.params.commentId
        }
    })
        .then(updated => {
            if (update && update[0] === 1) {
                res.status(202).json({
                    success: 'Comment Updated'
                });
            } else {
                res.status(404).json({
                    error: 'Comment not found'
                })
            }
        })

})

// DELETE /api/v1/comments/2323
router.delete('/:commentId', (req, res) => {
    models.Comment.destroy({
        where: {
            id: req.params.commentId
        }
    })
        .then(deleted => {
            if (deleted === 1) {
                res.status(202).json({
                    success: 'Comment deleted'
                });
            } else {
                res.status(404).json({
                    error: 'Post not found'
                })

            }
        })

})

module.exports = router;
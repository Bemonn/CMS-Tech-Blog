const express = require('express');
const Post = require('../../models/Post');
const Comment = require('../../models/Comment');
const User = require('../../models/User');
const router = express.Router();

router.get('/:id', async (req, res) => {
    try {
        const postData = await Post.findByPk(req.params.id, {
            include: [
                {
                    model: Comment,
                    include: {
                        model: User,
                        attributes: ['username']
                    }
                },
                {
                    model: User,
                    attributes: ['username']
                }
            ]
        });

        if (!postData) {
            res.status(404).render('error', { message: 'No post found with this ID' });
            return;
        }

        const post = postData.get({ plain: true });

        res.render('post', post);
    } catch (err) {
        console.error(err);
        res.status(500).render('error', { message: 'An error occurred.' });
    }
});

module.exports = router;
const express = require('express');
const Post = require('../../models/Post');
const router = express.Router();

// Middleware to ensure users are authenticated
function ensureAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

// Route to display all user-specific posts in the dashboard
router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        const userPosts = await Post.findAll({
            where: {
                user_id: req.session.user.id
            }
        });

        const posts = userPosts.map((post) => post.get({ plain: true }));

        res.render('dashboard', {
            posts,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

router.get('/create', (req, res) => {
    // Return the create post page
    res.render('createPost');
});

// Route to add a new post from the dashboard
router.post('/new', ensureAuthenticated, async (req, res) => {
    try {
        const newPost = await Post.create({
            ...req.body,
            user_id: req.session.user.id
        });

        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

// Route to display edit form for a specific post
router.get('/edit/:id', ensureAuthenticated, async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id);

        if (post) {
            res.render('edit-post', {
                post: post.get({ plain: true }),
                logged_in: req.session.logged_in
            });
        } else {
            res.status(404).json({ message: 'Post not found!' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

// Route to update a specific post
router.put('/edit/:id', ensureAuthenticated, async (req, res) => {
    try {
        const updatedPost = await Post.update(req.body, {
            where: {
                id: req.params.id,
                user_id: req.session.user.id
            }
        });

        if (updatedPost) {
            res.json({ message: 'Post updated successfully!' });
        } else {
            res.status(404).json({ message: 'Post not found!' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

// Route to delete a specific post
router.delete('/:id', ensureAuthenticated, async (req, res) => {
    try {
        const post = await Post.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user.id  // Ensure only the post owner can delete
            }
        });

        if (post) {
            res.json({ message: 'Post deleted successfully!' });
        } else {
            res.status(404).json({ message: 'Post not found!' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

module.exports = router;
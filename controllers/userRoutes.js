const express = require('express');
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const router = express.Router();

// The function to ensure users are authenticated
function ensureAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

router.get('/', async (req, res) => {
    try {
        // Fetch all posts from the database
        const postData = await Post.findAll();
        
        // Serialize data so the template can read it
        const posts = postData.map((post) => post.get({ plain: true }));

        // Pass serialized data and session flag into template
        ensureAuthenticated(req, res, () => {
            res.render('home', { 
                posts,
                logged_in: req.session.logged_in 
            });
        });

    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

router.get('/login', (req, res) => {
    // Return the login page
    res.render('login');
});

router.post('/login', async (req, res) => {
    const user = await User.findOne({ where: { username: req.body.username } });
    if (!user) {
        res.status(401).json({ message: 'No such user found' });
        return;
    }

    if (user.checkPassword(req.body.password)) {
        // Set up session data
        req.session.user = {
            id: user.id,
            username: user.username
        };
        req.session.logged_in = true;
        res.redirect('/'); // Redirecting to homepage after successful login
    } else {
        res.status(401).json({ message: 'Incorrect password' });
    }
});

router.get('/signup', (req, res) => {
    // Return the signup page
    res.render('signup');
});

router.post('/signup', async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        req.session.user = {
            id: newUser.id,
            username: newUser.username
        };
        req.session.logged_in = true;
        res.redirect('/'); // Redirecting to homepage after successful signup
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/post/:id', async (req, res) => {
    try {
        const postData = await Post.findByPk(req.params.id, {
            include: [
                { model: User },
                { model: Comment, include: [User] }
            ]
        });

        if (!postData) {
            res.status(404).json({ message: 'No post found with this ID' });
            return;
        }

        const post = postData.get({ plain: true });

        res.render('post', {
            ...post,
            logged_in: req.session.logged_in, 
            isAuthor: req.session.user_id === post.user_id
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/dashboard', ensureAuthenticated, async (req, res) => {
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

router.post('/dashboard/new', ensureAuthenticated, async (req, res) => {
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

router.get('/dashboard/new', ensureAuthenticated, (req, res) => {
    res.render('new-post', {
        logged_in: req.session.logged_in
    });
});

router.get('/dashboard/edit/:id', ensureAuthenticated, async (req, res) => {
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

router.post('/dashboard/edit/:id', ensureAuthenticated, async (req, res) => {
    try {
        const updatedPost = await Post.update(req.body, {
            where: {
                id: req.params.id,
                user_id: req.session.user.id
            }
        });

        if (updatedPost[0] > 0) { // Check if any rows were updated
            res.redirect('/dashboard');
        } else {
            res.status(404).json({ message: 'Post not found!' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

router.delete('/dashboard/:id', ensureAuthenticated, async (req, res) => {
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
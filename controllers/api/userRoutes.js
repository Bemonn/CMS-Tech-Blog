const express = require('express');
const User = require('../../models/User');
const Post = require('../../models/Post');
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
            id: user.user_id,
            username: user.username
        };
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
            id: newUser.user_id,
            username: newUser.username
        };
        res.redirect('/'); // Redirecting to homepage after successful signup
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
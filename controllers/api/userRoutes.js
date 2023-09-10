const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    // Return the homepage with all the posts
    res.render('homepage');
});

router.get('/login', (req, res) => {
    // Return the login page
    res.render('login');
});

router.get('/signup', (req, res) => {
    // Return the signup page
    res.render('signup');
});

module.exports = router;
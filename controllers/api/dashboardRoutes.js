const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    // Return the user's dashboard with all their posts
    res.render('dashboard');
});

router.get('/create', (req, res) => {
    // Return the create post page
    res.render('createPost');
});

router.get('/edit/:id', (req, res) => {
    // Return the edit post page for the given post ID
    res.render('editPost', { postId: req.params.id });
});

router.get('/delete/:id', (req, res) => {
    // Handle deleting the post for the given post ID
    res.redirect('/dashboard');
});

module.exports = router;
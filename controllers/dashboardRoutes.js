const express = require('express');
const router = express.Router();

router.get('/create', (req, res) => {
    // Return the create post page
    res.render('createPost');
});

module.exports = router;
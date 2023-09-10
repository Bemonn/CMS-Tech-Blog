const express = require('express');
const router = express.Router();

router.get('/:id', (req, res) => {
    // Return the individual post page with the post ID, including its comments
    res.render('post', { postId: req.params.id });
});

module.exports = router;
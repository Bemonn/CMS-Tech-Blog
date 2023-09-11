const router = require('express').Router();

const dashboardRoutes = require('./dashboardRoutes');
const postRoutes = require('./postRoutes');

router.use('/dashboard', dashboardRoutes);
router.use('/posts', postRoutes);

module.exports = router;
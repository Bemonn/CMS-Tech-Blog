const router = require('express').Router();

const apiRoutes = require('./api');
const userRoutes = require('./userRoutes');
const dashboardRoutes = require('./dashboardRoutes');

router.use('/api', apiRoutes);
router.use('/', userRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
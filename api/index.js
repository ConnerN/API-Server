const router = module.exports = require('express').Router();

router.use('/heroes', require('./heroes').router);
router.use('/skills', require('./skills').router);
router.use('/users', require('./users').router);
router.use('/reviews', require('./reviews').router);
router.use('/images', require('./images').router);
//router.use('/media', require('./media'));

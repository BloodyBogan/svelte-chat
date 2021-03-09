const router = require('express').Router();

const { handleSignUp, handleLogIn } = require('../controllers/api');

router.route('/auth/signup').post(handleSignUp);
router.route('/auth/login').post(handleLogIn);

module.exports = router;

const router = require('express').Router();

const { handleSignUp, handleLogIn } = require('../controllers/api');
const { signUpValidationRules, validate } = require('../config/validation');

router
  .route('/auth/signup')
  .post(signUpValidationRules(), validate, handleSignUp);
router.route('/auth/login').post(handleLogIn);

module.exports = router;

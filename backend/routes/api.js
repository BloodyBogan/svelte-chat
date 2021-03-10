const router = require('express').Router();

const {
  handleSignUp,
  handleLogIn,
  handleLogOut,
  handleUserInfo,
} = require('../controllers/api');
const {
  signUpValidationRules,
  logInValidationRules,
  validate,
} = require('../config/validation');
const { ensureAuthenticated } = require('../middleware/auth');

router
  .route('/auth/signup')
  .post(signUpValidationRules(), validate, handleSignUp);
router.route('/auth/login').post(logInValidationRules(), validate, handleLogIn);
router.route('/auth/logout').delete(handleLogOut);
router.route('/user').get(ensureAuthenticated, handleUserInfo);

module.exports = router;

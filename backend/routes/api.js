const router = require('express').Router();

const {
  handleSignUp,
  handleLogIn,
  handleLogOut,
  handleUserInfo,
  handleUserBioEdit,
} = require('../controllers/api');
const {
  signUpValidationRules,
  logInValidationRules,
  editBioValidationRules,
  validate,
} = require('../config/validation');
const { ensureAuthenticated } = require('../middleware/auth');

router
  .route('/auth/signup')
  .post(signUpValidationRules(), validate, handleSignUp);
router.route('/auth/login').post(logInValidationRules(), validate, handleLogIn);
router.route('/auth/logout').delete(handleLogOut);
router.route('/user').get(ensureAuthenticated, handleUserInfo);
router
  .route('/user/bio')
  .patch(
    ensureAuthenticated,
    editBioValidationRules(),
    validate,
    handleUserBioEdit
  );

module.exports = router;

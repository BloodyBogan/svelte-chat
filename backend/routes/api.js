const router = require('express').Router();

const {
  handleSignUp,
  handleLogIn,
  handleLogOut,
  handleUserInfo,
  handleUserBioEdit,
  handleUserPhotoChange,
  handleAddFriend,
  handleAcceptFriendRequest,
  handleDeclineFriendRequest,
} = require('../controllers/api');
const {
  signUpValidationRules,
  logInValidationRules,
  editBioValidationRules,
  addFriendValidationRules,
  validate,
} = require('../config/validation');
const { ensureAuthenticated } = require('../middleware/auth');

router
  .route('/auth/signup')
  .post(signUpValidationRules(), validate, handleSignUp);
router.route('/auth/login').post(logInValidationRules(), validate, handleLogIn);
router.route('/auth/logout').delete(ensureAuthenticated, handleLogOut);
router.route('/user').get(ensureAuthenticated, handleUserInfo);
router
  .route('/user/bio')
  .patch(
    ensureAuthenticated,
    editBioValidationRules(),
    validate,
    handleUserBioEdit
  );
router.route('/user/photo').post(ensureAuthenticated, handleUserPhotoChange);
router
  .route('/user/friends')
  .post(
    addFriendValidationRules(),
    validate,
    ensureAuthenticated,
    handleAddFriend
  );
router
  .route('/user/friends/accept')
  .post(ensureAuthenticated, handleAcceptFriendRequest);
router
  .route('/user/friends/decline')
  .post(ensureAuthenticated, handleDeclineFriendRequest);

module.exports = router;

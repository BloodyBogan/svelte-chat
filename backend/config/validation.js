const { body, validationResult } = require('express-validator');

const signUpValidationRules = () => [
  body('username')
    .not()
    .isEmpty()
    .withMessage('Username must not be empty')
    .trim()
    .escape()
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long'),
  body('password')
    .not()
    .isEmpty()
    .withMessage('Password must be at least 8 characters long')
    .trim()
    .escape()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .custom((password) => {
      if (password.search(/[0-9]/) === -1) {
        throw new Error('Password must contain at least one number');
      }

      return true;
    }),
  body('confirmPassword').custom((confirmPassword, { req }) => {
    const { password } = req.body;

    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    return true;
  }),
];

const logInValidationRules = () => [
  body('username')
    .not()
    .isEmpty()
    .withMessage('Username must not be empty')
    .trim()
    .escape(),
  body('password')
    .not()
    .isEmpty()
    .withMessage('Password must not be empty')
    .trim()
    .escape(),
];

const editBioValidationRules = () => [
  body('bio')
    .not()
    .isEmpty()
    .withMessage('Bio must not be empty')
    .trim()
    .escape()
    .isLength({ max: 70 })
    .withMessage('Bio must not be more than 70 characters long'),
];

const addFriendValidationRules = () => [
  body('searchValue')
    .not()
    .isEmpty()
    .withMessage('Username must not be empty')
    .trim()
    .escape(),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({
    success: false,
    errors: extractedErrors,
  });
};

module.exports = {
  signUpValidationRules,
  logInValidationRules,
  editBioValidationRules,
  addFriendValidationRules,
  validate,
};

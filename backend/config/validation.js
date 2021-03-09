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
    .contains(/[0-9]/)
    .withMessage('Password must contain at least one number'),
  body('confirmPassword').custom((confirmPassword, { req }) => {
    const { password } = req.body;

    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    return true;
  }),
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
  validate,
};

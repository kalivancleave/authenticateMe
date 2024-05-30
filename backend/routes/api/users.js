const express = require('express');
const bcrypt = require('bcryptjs');

const {setTokenCookie, requireAuth} = require('../../utils/auth');
const {User} = require('../../db/models');
const user = require('../../db/models/user');

const {check} = require('express-validator');
const {handleValidationErrors} = require('../../utils/validation');

const router = express.Router();

//validate sign up middleware
const validateSignup = [
  check('email')
    .exists({checkFalsy: true})
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({checkFalsy: true})
    .isLength({min: 4})
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({checkFalsy: true})
    .isLength({min: 6})
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];

//User Signup API Route
router.post('/', validateSignup, async (req, res, next) => {
  try {
    //deconstruct req.body
    const {email, password, username, firstName, lastName} = req.body;

    //use bcrypt hashsync for password to store in database
    const hashedPassword = bcrypt.hashSync(password);

    //create a new user
    const newUser = await User.create({
      email,
      username,
      firstName,
      lastName,
      hashedPassword
    });   
    
    //create a safe user to return to frontend
    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username
    };

    //set token cookie with nonsensitive info as payload
    await setTokenCookie (res, safeUser);

    //return requested json response
    res.json({
      user: safeUser
    });
    
  } catch (error) {
    next(error)
  }
})

module.exports = router;
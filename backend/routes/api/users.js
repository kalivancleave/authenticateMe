const express = require('express');
const bcrypt = require('bcryptjs');

const {setTokenCookie, requireAuth} = require('../../utils/auth');
const {User} = require('../../db/models');
const user = require('../../db/models/user');

const router = express.Router();

//User Signup API Route
router.post('/', async (req, res, next) => {
  try {
    //deconstruct req.body
    const {email, password, username} = req.body;

    //use bcrypt hashsync for password to store in database
    const hashedPassword = bcrypt.hashSync(password);

    //create a new user
    const newUser = await User.create({
      email,
      username,
      hashedPassword
    });   
    
    const safeUser = {
      id: user.id,
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
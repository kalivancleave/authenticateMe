const express = require('express');
const {Op} = require('sequelize');
const bcrypt = require('bcryptjs');

const {setTokenCookie, restoreUser} = require('../../utils/auth');
const {User} = require('../../db/models');

const router = express.Router();

//User Login API Route
router.post('/', async(req, res, next) => {
  try {
    //destructure from req.body
    const {credential, password} = req.body;

    //find a user with the username or email in the db
    const user = await User.unscoped().findOne({
      where: {
        [Op.or]: {
          username: credential,
          email: credential
        }
      }
    });

    //404 - no user found OR password does not match hashed password
    if(!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
      const error = new Error('Login failed');
      error.status = 401;
      error.title = "Login failed";
      error.errors = {credential: 'The provided credentials were invalid.'};
      //written this way to not give away what is incorrect
      return next(error);
    };

    //correct user and password - setTokenCookie
    const safeUser = {
      id: user.id,
      email: user.email,
      username: user.username
    };

    await setTokenCookie(res, safeUser);

    //return requested JSON response
    res.json({user: {safeUser}})

  } catch (error) {
    next(error)
  }
});

//User Logout API Route
router.delete('/', async (req, res, next) => {
  try {
    res.clearCookie('token');
    res.json({
      message: "success"
    });    
  } catch (error) {
    next(error)
  }
})


module.exports = router;
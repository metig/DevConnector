const express = require('express');
const router = express.Router();
const user = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

// load input validation
const validateRegisterInput = require('../../validation/register');
const validateloginInput = require('../../validation/login');

// @route POST api/users/register
// @desc  Register user
// @access Public
router.post('/register', (req, res) => {
const {errors, isValid} = validateRegisterInput(req.body);

    // Check validation
   if (!isValid){
       return res.status(400).json(errors);
   }


   user
   .findOne({email: req.body.email })
   .then(user => {
       if (user) {
           errors.email =  'Email already exists'
           return res.status(400).json(errors)
       } else {
           const avatar = gravatar.url(req.body.email, {
               s: '200',
               r: 'pg',
               d: 'mm'
           });

           const newUser = new User({
               name: req.body.name,
               email: req.body.email,
               avatar: avatar,  //we can use only one "avatar" if the value is the same in both sides
               password: req.body.password
           });

            bcrypt.genSalt(10, (err, salt) => {
              if (err) throw err;
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                  if (err) throw err;
                  newUser.password = hash;
                  newUser.save()
                  .then(user => res.json(user))
                  .catch(err => console.log(err));
              });
          });
       }
   })
   .catch(err => console.log(err));

})

// @route POST api/users/login
// @desc  login user
// @access Public
router.post('/login', (req,res) =>{
    const {errors, isValid} = validateloginInput(req.body);

            // Check validation
           if (!isValid){
               return res.status(400).json(errors);
           }
        

            const email = req.body.email;
            const password = req.body.password;

            //find user by email
            User.findOne({email})
            .then(user => {
                if (!user){
                    errors.email = 'User not found'
                    return res.status(404).json(errors);
                }

                //check for password
                bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        //user matched
                        const payload = {
                            id: user.id,
                            name: user.name,
                            avatar: user.avatar
                        };
                        // sign a token
                        jwt.sign(
                            payload, 
                            keys.secretOrKey,
                            {expiresIn: 3600},
                            (err, token) => {
                                return res.json({
                                    success: true,
                                    token:'Bearer ' + token
                                });
                            }
                            );
                    }
                    else {
                        errors.password = 'Password incorrect'
                        return res.status(400).json(errors);
                    }
                })
            })
            .catch(err => console.log(err));
        })

// @route GET api/users/current
// @desc  Return current user
// @access Private
router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.json(req.user);
})


module.exports = router;
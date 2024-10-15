// @login & register
const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const bcrypt = require('bcrypt');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const {secretAccessKey} = require("../../config/keys");
const passport = require("passport");

// $router GET api/users/test
// @desc 返回的请求的json数据
// @access public
router.get('/test', (req, res) => {
    res.json({msg:"Logged in"});
})

// $router POST api/users/register
// @desc 返回的请求的json数据
// @access public
router.post('/register', (req, res) => {
    // console.log(req.body);

    // 查询数据库中是否拥有邮箱
    User.findOne({user_email: req.body.user_email})
        .then(user => {
            if(user){
                return res.status(400).send({msg:"User already exists"});
            }else{
                const user_avatar = gravatar.url(req.body.user_email , {s:"200",r:"pg",d:"mm"});
                const newUser = new User({
                    user_name: req.body.user_name,
                    user_email: req.body.user_email,
                    user_password: req.body.user_password,
                    user_identity:req.body.user_identity,
                    user_avatar,
                })
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.user_password,salt, (err, hash) => {
                        if (err) throw err;
                        newUser.user_password = hash;
                        newUser.save()
                            .then(user => res.json({msg:"User saved successfully",user}))
                            .catch(err => console.log(err));
                    });
                });
            }
        })
})

// $router POST api/users/login
// @desc 返回token jwt passport
// @access public

router.post('/login', (req, res) => {
    const user_email = req.body.user_email;
    const user_password = req.body.user_password;
    User.findOne({user_email})
        .then(user => {
            if (!user) {
                return res.status(404).json({msg: "User does not exist"});
            }
            bcrypt.compare(user_password, user.user_password)
                .then(isMatch => {
                    if (isMatch) {
                        const rule = {id:user.id , name:user.user_name,avatar:user.avatar , identity : user.user_identity};
                        jwt.sign(rule, keys.secretAccessKey,{expiresIn:3600}, (err, token) => {
                            if (err) throw err;
                            res.json({
                                success:true,
                                token:"Bearer " + token,
                            })
                        })
                    } else {
                        return res.status(400).json({msg: "password not match"});
                    }
                })
        })
})

// $router GET api/users/current
// @desc return current user
// @access Private
router.get('/current', passport.authenticate("jwt", { session: false }), (req, res) => {
    console.log('Request user:', req.user);
    if (req.user) {
        return res.json({
            id: req.user._id,
            name: req.user.user_name,
            email: req.user.user_email,
            identity: req.user.user_identity,
        });
    } else {
        return res.status(401).json({ msg: "User not found" });
    }
});

module.exports = router;
// @login & register
const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const bcrypt = require('bcrypt');
const gravatar = require('gravatar');

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
                    // user_avatar: req.body.user_avatar,
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

module.exports = router;
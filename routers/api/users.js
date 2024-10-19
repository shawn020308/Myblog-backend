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
    res.json({msg:"Test Ok"});
})

// $router POST api/users/register
// @desc 返回的请求的json数据
// @access public
router.post('/register', async (req, res) => {
    try {
        // 解构请求体中的字段
        const { user_name, user_email, user_password, user_identity } = req.body;

        // 检查必要字段
        if (!user_name || !user_email || !user_password) {
            return res.status(400).send({ msg: "Please provide all required fields" });
        }

        // 打印输入的密码以进行调试
        console.log('User password before hashing:', user_password);

        // 检查用户是否已经存在
        const existingUser = await User.findOne({ user_email });
        if (existingUser) {
            return res.status(400).send({ msg: "User already exists" });
        }

        // 生成用户头像
        const user_avatar = gravatar.url(user_email, { s: "200", r: "pg", d: "mm" });

        // 创建新用户
        const newUser = new User({
            user_name,
            user_email,
            user_identity,
            user_avatar,
        });

        // 生成盐并加密密码
        const salt = await bcrypt.genSalt(10);
        newUser.user_password = await bcrypt.hash(user_password, salt);

        // 保存用户到数据库
        await newUser.save();
        return res.json({ msg: "User saved successfully", user: newUser });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).send({ msg: "Server error" });
    }
});

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
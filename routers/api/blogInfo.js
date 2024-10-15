const express = require('express');
const router = express.Router();
const BlogInfo = require('../../models/BlogInfo');
const passport = require("passport");

// $router GET api/blogInfo/test
// @desc 返回的请求的json数据
// @access public
router.get('/test', (req, res) => {
    res.json({msg: "BlogInfo works"});
})

// $router POST api/blogInfo/add
// @desc 创建博文接口
// @access private
router.post('/add', passport.authenticate("jwt", { session: false }), (req, res) => {
    const blogInfoFields = {};
    if (req.body.title) blogInfoFields.title = req.body.title;
    if (req.body.content) blogInfoFields.content = req.body.content;
    if (req.body.author) blogInfoFields.author = req.body.author;
    if (req.body.tags) blogInfoFields.tags = req.body.tags;
    if (req.body.is_published !== undefined) blogInfoFields.is_published = req.body.is_published; // 确保 boolean 被正确处理
    // console.log(blogInfoFields);
    // 创建新的 BlogInfo 实例并保存
    new BlogInfo(blogInfoFields).save()
        .then(blogInfo => {
            res.json(blogInfo);
        })
        .catch(err => {
            res.status(400).json({ error: "Error saving blog info" });
        });
})

module.exports = router;

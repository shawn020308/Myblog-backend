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
            res.status(400).json((err));
        });
})


// $router GET api/blogInfo
// @desc 获取所有信息
// @access private
router.get('/', passport.authenticate("jwt", { session: false }), (req, res) => {
    BlogInfo.find()
        .then(blogInfo => {
            if (!blogInfo) {
                return res.status(404).json({msg: "Blog not found"});
            }
            res.json(blogInfo);
        })
        .catch(err => {res.status(404).json(err);})
})

// $router GET api/blogInfo/:id
// @desc 获取单个信息
// @access private
router.get('/:id', passport.authenticate("jwt", { session: false }), (req, res) => {
    BlogInfo.findOne({_id:req.params.id})
        .then(blogInfo => {
            if (!blogInfo) {
                return res.status(404).json({msg: "Blog not found"});
            }
            res.json(blogInfo);
        })
        .catch(err => {res.status(404).json(err);})
})


// $router POST api/blogInfo/edit
// @desc edit the blog
// @access private
router.post('/edit/:id', passport.authenticate("jwt", { session: false }), (req, res) => {
    const blogInfo = {};
    if (req.body.title) blogInfo.title = req.body.title;
    if (req.body.content) blogInfo.content = req.body.content;
    if (req.body.is_published) blogInfo.is_published = req.body.is_published;
    if (req.body.tags) blogInfo.tags = req.body.tags;

    BlogInfo.findOneAndUpdate(
        { _id: req.params.id },
        {$set:blogInfo},
        {new:true}
    ).then(blogInfo => {res.json(blogInfo);})
})

// $router POST api/blogInfo/delete/:id
// @desc 获取单个信息
// @access private
router.delete('/delete/:id', passport.authenticate("jwt", {session: false}), (req, res) => {
    BlogInfo.findOneAndDelete({_id:req.params.id})
        .then(blogInfo => {
        blogInfo.save().then(blogInfo => {res.json(blogInfo);})
        })
        .catch(err => {res.status(404).json(err);})
    }
)

module.exports = router;

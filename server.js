const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const app = express();
const port =  process.env.PORT |  3001;
const bodyParser = require("body-parser");
const passport = require("passport");


// 引入user.js
const users = require('./routers/api/users');

// db config
const db = require("./config/keys").mongoURI;
mongoose.connect(db)
    .then(() => {
        console.log("MongoDB connected successfully!");
    })
    .catch(err => {
        console.error("MongoDB connection error:", err);
    });
// passport initialize
app.use(passport.initialize());

require("./config/passport")(passport);

//添加日志记录
app.use(morgan('combined'));
const fs = require('fs');
const path = require('path');
// 创建一个写入流
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));


// 使用body-parser 中间件
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());
app.use(express.json()); // 处理JSON请求

app.use("/api/users",users)

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


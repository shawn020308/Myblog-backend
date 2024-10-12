const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const port =  process.env.PORT |  3000;
const bodyParser = require("body-parser");

// 引入user.js
const users = require('./routers/api/users');

// db config
const db = require("./config/keys").mongoURI;
mongoose.connect(db)
    .then(() => console.log("Connected!"))
    .catch(err => console.log(err));

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


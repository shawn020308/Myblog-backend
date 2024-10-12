const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const port =  process.env.PORT |  3000;

//
const users = require('./routers/api/users');

// db config
const db = require("./config/keys").mongoURI;
mongoose.connect(db)
    .then(() => console.log("Connected!"))
    .catch(err => console.log(err));

app.use(cors());
app.use(express.json()); // 处理JSON请求

app.use("/api/users",users)

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


app.get('/', (req, res) => {
    res.send("hello world!");
})

// 获取所有博文
app.get('/api/posts', (req, res) => {
    db.all("SELECT * FROM posts", (err, rows) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(rows);
        }
    });
});

// 创建新博文
app.post('/api/posts', (req, res) => {
    const { title, content } = req.body;
    db.run(`INSERT INTO posts (title, content) VALUES (?, ?)`, [title, content], function(err) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).json({ id: this.lastID, title, content });
        }
    });
});

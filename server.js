const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
require('dotenv').config();

app.use(express.json());

const posts = [
  { name: "Saibaba", title: "Welcome Saibaba" },
  { name: "CBIT", title: "Welcome from CBIT" }
];

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.post('/login', (req, res) => {
  const username = req.body.username;
  const user = { name: username };
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  res.json({ accessToken: accessToken });
});

app.use(authenticateToken);

app.get('/posts', (req, res) => {
  console.log(req.user.name);
  res.json(posts.filter(post => post.name === req.user.name));
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

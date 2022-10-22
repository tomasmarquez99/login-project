var express = require('express');
var path = require('path');
var bodyParser = require('body-parser')
var mongoose = require('mongoose');
var User = require('./models/user');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const { response } = require('express');
const { ok } = require('assert');

const JWT_SECRET = 'JKJHAygBFYG!@bm,@$%#@j^ERTrstl;hBERT#rt^#$%ERergdhyuoyheFWT36YERYt'

mongoose.connect('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.5.4', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

var app = express();
app.use('/', express.static(path.join(__dirname, 'static')));
app.use(bodyParser.json());

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username, password }).lean();

  if (!user) {
    return res.json({ status: 'error', error: 'Invalid username/password' })
  }

  if (await bcrypt.compare(password, user.password)) {
    // the username, password combination is successful

    const token = jwt.sign({
      id: user._id, 
      username: user.username 
    }, 
    JWT_SECRET
    )

    return res.json({ status: 'ok', data: token })
  }

  res.json({ status: 'error', data: 'Invalid username/password' })
});

app.post('/api/register', async (req, res) => {
  console.log(req.body)

  const { username, password: plainTextPassword } = req.body;

  if (!username || typeof username !== 'string') {
    return res.json({ status: 'error', error: 'Invalid username' })
  }

  if (!plainTextPassword || typeof plainTextPassword !== 'string') {
    return res.json({ status: 'error', error: 'Invalid password' })
  }

  if (plainTextPassword.length < 5) {
    return res.json({ status: 'error', error: 'Password too small. Should be at least six characters' })
  }

  const password = await bcrypt.hash(plainTextPassword, 10);

  // console.log(await bcrypt.hash(password, 10));

  try {
    const response = await User.create({
      username,
      password
    })
    console.log('User created successfully: ', response)
  } catch (error) {
    //console.log(JSON.stringify(error))
    if (error.code === 11000) {
      return res.json({ status: 'error', error: 'Username already in use' });
    }
    throw error
  }

  res.json({ status: 'ok' })
})

app.listen(9999, () => {
  console.log('Server up at 9999')
})

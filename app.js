var express = require('express');
var path = require('path');
var bodyParser = require('body-parser')
var mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.5.4', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
var app = express();
app.use('/', express.static(path.join(__dirname, 'static')));
app.use(bodyParser.json());

app.post('/api/register', async (req,res) => {
  console.log(req.body)
  res.json({status: 'ok'})
})

app.listen(9999, ()=>{
  console.log('Server up at 9999')
})

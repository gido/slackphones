require('dotenv').load();

var express = require('express');
var request = require("request-with-cookies");

var app = express();

var bodyParser = require('body-parser')
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
})); 

var port = process.env.PORT || 3001;

app.get('/', function (req, res) {
  res.send('hi.');
});

app.post('/slack/telephones', function (req, res) {

  console.log(req.body);

  if (req.body.token !== process.env.SLACK_TOKEN) {
    return res.status(401).send('Unauthorized Slack account');
  }

  res.status(200).send('Super !');
});

app.get('/health_check', function (req, res) {
  res.send('good');
})

app.listen(port, function () {
  console.log('slackphones started on port ' + port);
});

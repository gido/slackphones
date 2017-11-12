require('dotenv').load();

var express = require('express');

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

    res.set('Content-Type', 'text/xml').status(200).send(message.toString());
});

app.get('/health_check', function (req, res) {
  res.send('good');
})

app.listen(port, function () {
  console.log('slackphones started on port ' + port);
});

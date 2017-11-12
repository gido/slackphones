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

  let phones = [
    {
      'name': 'Gilles',
      'shortPhone': 22,
      'online': true,
    }
  ];


  const fields = phones.map(function(phone) {
    const onlineEmoji = phone.online ? ":white_check_mark:" : ':x:';
    return {
      'title': phone.name,
      'value': `${phone.shortPhone} ${onlineEmoji}`,
      'short': true,
    }
  });

  const attachments = {
    "attachments": [
        {
            "text": "Liste des numéros de téléphone:",
            "fields": fields,
            "color": "#F35A00"
        }
    ]
}

  res.status(200).set('Content-Type', 'application/json').send(JSON.stringify(attachments));
});

app.get('/health_check', function (req, res) {
  res.send('good');
})

app.listen(port, function () {
  console.log('slackphones started on port ' + port);
});

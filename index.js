require('dotenv').load();

const express = require('express');
const request = require('request-with-cookies');
const cheerio = require('cheerio')

const app = express();

const bodyParser = require('body-parser')
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
})); 

const port = process.env.PORT || 3001;

function fetchPhoneNumbers(callback) {
  const client = request.createClient({ followRedirect: false, followAllRedirects: false });
  const loginUrl = 'https://me.peoplefone.ch/en/home/index/';
  const userUrl = 'https://me.peoplefone.ch/en/pbxusers/users/';

  const formData = {
    //'_token': token,
    'logincode': '',
    'loginuser': process.env.PEOPLEFONE_USER,
    'loginpass': process.env.PEOPLEFONE_PASSWORD
  };

  // login
  client.post({ url: loginUrl, form: formData }, function(err, response, body) {
    if (err) {
      callback(err);
      return;
    }

    // extract phone list
    client(userUrl, function (err, response, body) {
      const $ = cheerio.load(body);
      const phones = [];
      $('div#content tr').each(function(i, el) {
        const number = $(el).find('td:nth-child(2)').text();
        const name = $(el).find('td:nth-child(3)').text();
        const online = $(el).find('td:nth-child(4)').attr('class') === 'color_green' ? true : false;

        phones.push({
          'name': name,
          'shortPhone': number,
          'online': online
        });
      });

      callback(null, phones);
    });
  });
}

app.get('/', function (req, res) {
  res.send('hi!');
});

app.post('/slack/telephones', function (req, res) {

  if (req.body.token !== process.env.SLACK_TOKEN) {
    return res.status(401).send('Unauthorized Slack account');
  }

  const client = request.createClient();

  // Fetch the csrf token
  fetchPhoneNumbers(function (err, phones) {

    if (err) {
      res.status(500).send('Error while fetching phone data: ' + err);
      return;
    }

    // Format response
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
          "color": "good"
        }
      ]
    };

    res.status(200).set('Content-Type', 'application/json').send(JSON.stringify(attachments));
  });
});

app.get('/health_check', function (req, res) {
  res.send('good');
})

app.listen(port, function () {
  console.log('slackphones started on port ' + port);
});

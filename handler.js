'use strict';

const request = require('request');
const qs = require('qs');
const config = require('./config');

const replacements = [
  [/{W}/g, ':white_circle:'],
  [/{U}/g, ':large_blue_circle:'],
  [/{B}/g, ':black_circle:'],
  [/{R}/g, ':red_circle:'],
  [/{G}/g, ':tennis:'],
  [/{/g, ''],
  [/}/g, '']
];

module.exports.findCard = (event, context, callback) => {

  var params = qs.parse(event.body);
  var text = params['text'];
  var token = params['token'];

  if (token != config.token) {
    callback(null, {
      statusCode: 403,
      body: JSON.stringify({
        'error': 'Forbidden.'
      })
    });
    return;
  }

  request.get({
    url: 'https://api.deckbrew.com/mtg/cards?name=' + text,
    json: true,
    }, (err, res, data) => {

    if(data.length == 0) {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          'text': 'No matching card found.',
          'response_type': 'in_channel',
          'attachments': []
        })
      });
      return;
    }

    var name = data[0]['name'];
    var cardtext = data[0]['text'];
    var imageurl = data[0]['editions'][0]['image_url'];
    var types = data[0]['types'][0];
    var cost = data[0]['cost'];

    replacements.forEach(replacement =>{
      cardtext = cardtext.replace(replacement[0], replacement[1]);
      cost = cost.replace(replacement[0], replacement[1]);
    });

    var response = {
         'text': name,
         'response_type': 'in_channel',
          'attachments': [{
            'text': cardtext,
            'fields': [
              {
                  'title': 'Types',
                  'value': types,
                  'short': true
              },
              {
                  'title': 'Cost',
                  'value': cost,
                  'short': true
              },
          ],
          'image_url': imageurl
        }]
    };

    callback(null, {
      statusCode: 200,
      body: JSON.stringify(response)
    });
});

};

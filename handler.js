'use strict';

var request = require('request');
var qs = require('qs');

const replacements = [
  ['{W}', ':white_circle:'],
  ['{U}', ':large_blue_circle:'],
  ['{B}', ':black_circle:'],
  ['{R}', ':red_circle:'],
  ['{G}', ':tennis:'],
  ['{', ''],
  ['}', '']
];

module.exports.findCard = (event, context, callback) => {

  var params = qs.parse(event.body);
  var text = params['text'];

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

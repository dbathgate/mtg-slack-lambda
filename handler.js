'use strict';

const request = require('request');
const qs = require('qs');
const fs = require('fs');
const _ = {
  merge: require('lodash.merge'),
  forEach: require('lodash.forEach')
};

var config = require('./config.default');

if (fs.existsSync('./config.override.js')) {
  var configOverrides = require('./config.override');
  config = _.merge(config, configOverrides);
}

module.exports.findCard = (event, context, callback) => {

  var params = qs.parse(event.body);
  var text = params['text'];
  var token = params['token'];

  if (token != config.app.token) {
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

    _.forEach(config.replacements, (item) => {
      cardtext = cardtext.replace(item.pattern, item.replacement);
      cost = cost.replace(item.pattern, item.replacement);
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

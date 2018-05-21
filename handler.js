'use strict';

const request = require('request');
const qs = require('qs');
const fs = require('fs');
const _ = {
  merge: require('lodash.merge'),
  forEach: require('lodash.foreach')
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
    url: 'https://api.magicthegathering.io/v1/cards?pageSize=1&name=' + text,
    json: true,
    }, (err, res, data) => {

    const cards = data.cards;

    if(cards.length == 0) {
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

    const card = cards[0];

    var name = card['name'];
    var cardtext = card['text'];
    var imageurl = card['imageUrl'];
    var types = card['types'].join(' ');
    var cost = card['manaCost'];

    _.forEach(config.replacements, (item) => {
      if (cardtext) {
        cardtext = cardtext.replace(item.pattern, item.replacement);
      }

      if (cost) {
        cost = cost.replace(item.pattern, item.replacement);
      }

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

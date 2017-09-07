'use strict';

module.exports = {
  app: {
    token: '<your token here>',
  },
  replacements: {
    white: {
      pattern: /{W}/g,
      replacement: ':white_circle:'
    },
    blue: {
      pattern: /{U}/g,
      replacement: ':large_blue_circle:'
    },
    black: {
      pattern: /{B}/g,
      replacement: ':black_circle:'
    },
    red: {
      pattern: /{R}/g,
      replacement: ':red_circle:'
    },
    green: {
      pattern: /{G}/g,
      replacement: ':tennis:'
    },
    leftBrace: {
      pattern: /{/g,
      replacement: ''
    },
    rightBrace: {
      pattern: /}/g,
      replacement: ''
    }
  }
};

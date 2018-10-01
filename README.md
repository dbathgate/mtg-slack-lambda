# Setup

Add Slack Verification Token to `config.default.js`
```
module.exports = {
  app: {
    token: '<your token here>'
  }
};
```

# Overriding Default Configurations

Create `config.override.js` to override default settings
```
module.exports = {
  replacements: {
    white: {
      pattern: /{W}/g,
      replacement: ':mana-white:'
    }
};
```

# Install

```
npm install -g serverless

export AWS_ACCESS_KEY_ID=<your access key>
export AWS_SECRET_ACCESS_KEY=<your secret key>

npm install
```


# Testing Locally

```
serverless invoke local -f findCard --data '{"body": "token=<your token here>&text=mummy"}'
```

# Deploy
```
serverless deploy
```

# Cleanup
*If you want to tear down the AWS Lambda function*
```
serverless remove
```

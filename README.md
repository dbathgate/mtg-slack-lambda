# Setup

Add Slack Verification Token to `config.js`
```
module.exports = {
  token: '<your toen here>'
};
```

# Install

```
npm install -g serverless

export AWS_ACCESS_KEY_ID=<your access key>
export AWS_SECRET_ACCESS_KEY=<your secret key>

npm install
```

# Deploy
```
serverless deploy
```

# Cleanup
** If you want to tear the AWS Lambda function down*
```
serverless remove
```

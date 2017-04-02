'use strict';

// importing AWS sdk
import AWS from 'aws-sdk';

// importing config file which contains AWS key
// Best practice: to use a config.copy.json when pushing to github
// Coz exposing the AWS keys to public is not good
import config from './config.json';

AWS.config.update({
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey,
  region: config.aws.region
});

// Instatiating the SES from AWS SDK
let ses = new AWS.SES();

// Structure of sendMail params structure:
/*
var params = {
  Destination: {  / required /
    BccAddresses: [
      'STRING_VALUE',
      / more items /
    ],
    CcAddresses: [
      'STRING_VALUE',
      / more items /
    ],
    ToAddresses: [
      'STRING_VALUE',
      / more items /
    ]
  },
  Message: { / required /
    Body: { / required /
      Html: {
        Data: 'STRING_VALUE', / required /
        Charset: 'STRING_VALUE'
      },
      Text: {
        Data: 'STRING_VALUE', / required /
        Charset: 'STRING_VALUE'
      }
    },
    Subject: { / required /
      Data: 'STRING_VALUE', / required /
      Charset: 'STRING_VALUE'
    }
  },
  Source: 'STRING_VALUE', / required /
  ConfigurationSetName: 'STRING_VALUE',
  ReplyToAddresses: [
    'STRING_VALUE',
    / more items /
  ],
  ReturnPath: 'STRING_VALUE',
  ReturnPathArn: 'STRING_VALUE',
  SourceArn: 'STRING_VALUE',
  Tags: [
    {
      Name: 'STRING_VALUE', / required /
      Value: 'STRING_VALUE' / required /
    },
    / more items /
  ]
};

ses.sendEmail(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});

*/

// The function to send SES email message
module.exports.sendMail = (event, context, callback) => {

  let bccEmailAddresses = event.body.bccEmailAddresses;
  let ccEmailAddresses = event.body.ccEmailAddresses;
  let toEmailAddresses = event.body.toEmailAddresses;
  let bodyData = event.body.bodyData;
  let bodyCharset = event.body.bodyCharset;
  let subjectdata = event.body.subjectdata;
  let subjectCharset = event.body.subjectCharset;
  let sourceEmail = event.body.sourceEmail;
  let replyToAddresses = event.body.replyToAddresses;

// The parameters for sending mail using ses.sendEmail()
  let emailParams = {
    Destination: {
      BccAddresses: bccEmailAddresses,
      CcAddresses: ccEmailAddresses,
      ToAddresses: toEmailAddresses
    },
    Message: {
      Body: {
        Text: {
          Data: bodyData,
          Charset: bodyCharset
        }
      },
      Subject: {
        Data: subjectdata,
        Charset: subjectCharset
      }
    },
    Source: sourceEmail,
    ReplyToAddresses: replyToAddresses
  };

// the response to send back after email success.
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Mail sent successfully'
    }),
  };

// The sendEmail function taking the emailParams and sends the email requests.
  ses.sendEmail(emailParams, function (err, data) {
      if (err) {
          console.log(err, err.stack);
          callback(err);
      } else {
          console.log(data);
          callback(null, response);
      }
  });

};

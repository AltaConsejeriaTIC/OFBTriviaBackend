'use strict';
const serverKey ='AAAAvsOAD0M:APA91bGzwNXpdISdcNp9W-l_YfYph-lswJUW9cKUPnzkt36ty1qTXg9c2ilrjp_uf1xelUKdD9AWlpKHZxyaSfOy0fmHWCTG16c1y_szTxe5Yp_JNE0r9THJNKm2D0RrnZKFiPxstvpE';
const FCM = require('fcm-node');
const { Token } = require("../models/Token");
const cron = require('node-cron');
const Question = require('../models/Question');

module.exports = {
  addToken: addToken,
  send: send

};

function addToken(req, res) {
  const token = req.swagger.params.token;

  Token.query().insert({token:token.value})
    .then(response => {
      console.log("Token Registered"+ token );
      res.status(201).send({ token: token });
    })
    .catch(e => {
      console.error(e);
      res.json({token:'ERROR'});
    });
}

function send(req, res) {
  let fcm = new FCM(serverKey);
  Token.query().then((tokens) => {
    tokens.forEach(function (element) {
      const message = {
        to: element.token,
        notification: {
          title: req.body.title,
          body: req.body.body
        }
      };
      fcm.send(message, function (err) {
        if (err) {
          console.log("Error sending notification to ", element.id)
        } else {
          console.log("Success sending notification to ", element.id)
        }
      });
    });
  }).catch((e) => console.error(e));

  res.json({result: 'NOTIFICATION PROCESS HAS STARTED'});
}


function sendToAll(subject, body){
  let fcm = new FCM(serverKey);
  Token.query().then((tokens) => {
    tokens.forEach(function (element) {
      const message = {
        to: element.token,
        notification: {
          title: subject,
          body: body
        }
      };
      fcm.send(message, function (err) {
        if (err) {
          console.log("Error sending notification to ", element.id)
        } else {
          console.log("Success sending notification to ", element.id)
        }
      });
    });
  }).catch((e) => console.error(e));
}

cron.schedule('* * * * *', () => {
  Question.query().
  select().
    where('question_start_date', '<=', new Date())
    .andWhere('question_active', true)
    .andWhere('notified', false).then(questions => {
      questions.forEach(function (element) {
        sendToAll('Se ha publicado una nueva trivia', element.question_content)
        element.notified = true;
        Question.query().update(element). where('question_id', element.question_id).
        then(rows => {
          console.log(`Question ${element.question_content} notified successfully`);
        });
      });
      if(!questions || questions.length===0){
        console.log("Nothing to notify")
      }
      else{
        console.log("Notifying questions", questions);
      }
  });
});
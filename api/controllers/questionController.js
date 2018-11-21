'use strict';

const queryHelpers = require('../helpers/queryHelpers');
const Question = require('../models/Question');
const helpers = require('../helpers/helpers');

function getTriviaInfo(req, res) {
  queryHelpers.getCurrentQuestion.
  then(question => res.json({
    content: question[0].content,
    endDate: question[0].endDate
  }));
}

function createQuestion(req, res){
  Question.query().insert({
    question_content: req.body.content,
    question_start_date: req.body.startDate,
    question_end_date: req.body.endDate,
    question_real_answer: req.body.answer
  }).
  then(question => {
    
    if (question)
      res.status(201).send({message: "question created"});
    
    else
      res.status(500).send({message: "an error ocurred"});
  }).
  catch(e => console.log(e));
}

module.exports = {
  getTriviaInfo: getTriviaInfo,
  createQuestion: createQuestion
};

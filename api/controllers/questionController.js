'use strict';

const queryHelpers = require('../helpers/queryHelpers');
const Question = require('../models/Question');
const constants = require('../helpers/constants');
const knex = require('../../config/triviaDBConnection').knex;

const comparators = {
  '>': (leftElement, rightElement) => leftElement > rightElement,
  '<': (leftElement, rightElement) => leftElement < rightElement
};
const stringDateTime = (date) => (new Date(date)).getTime();
const daysDiff = (oldTime, newTime) => Math.abs(stringDateTime(oldTime) -
                                                stringDateTime(newTime))/86400000;

function getTriviaInfo(req, res) {
  queryHelpers.getCurrentQuestion.
  then(question => res.json({
    content: question[0].content,
    endDate: question[0].endDate
  }));
}

function validateDatesIntersections(booleanOperator, oldStartDate, oldEndDate,
                                    newStartDate, newEndDate){
  const comparator = comparators[booleanOperator];
  
  return comparator(oldStartDate, newStartDate) &&
         comparator(oldStartDate, newEndDate) &&
         comparator(oldEndDate, newStartDate) &&
         comparator(oldEndDate, newEndDate);
}

function validateDatesBetweenQuestions(oldQuestionDates, newQuestionDates){
  var oldStartDate = stringDateTime(oldQuestionDates.startDate);
  var oldEndDate = stringDateTime(oldQuestionDates.endDate);
  var newStartDate = stringDateTime(newQuestionDates.startDate);
  var newEndDate = stringDateTime(newQuestionDates.endDate);
  
  return validateDatesIntersections('<', oldStartDate, oldEndDate,
                                    newStartDate, newEndDate) ||
         validateDatesIntersections('>', oldStartDate, oldEndDate,
                                    newStartDate, newEndDate);
}

function lookForDateCollissions(oldQuestionDates, newQuestionDates){
  
  return daysDiff(oldQuestionDates.startDate, newQuestionDates.endDate) >=
         constants.daysBetweenQuestions;
}

function insertQuestion(question, res){
  Question.query().insert(question).
  then(question => {
    
    if (question)
      res.status(201).send({message: "question created"});
    
    else
      res.status(500).send({message: "an error ocurred"});
  }).
  catch(e => console.log(e));
}

function validateQuestionDates(question, newQuestionDates, res){
  const areDatesOK = (oldDates) =>
        lookForDateCollissions(oldDates, newQuestionDates) &&
        validateDatesBetweenQuestions(oldDates, newQuestionDates);
  Question.query().
  select('question_start_date as startDate', 'question_end_date as endDate').
  then(oldQuestionDates => {
    
    if (!oldQuestionDates.filter(oldDate => !areDatesOK(oldDate)).length)
      insertQuestion(question, res);
    
    else
      res.status(500).send({message: "question dates collides with other question"});
  });
}

function createQuestion(req, res){
  const question = {
    question_content: req.body.content,
    question_start_date: req.body.startDate,
    question_end_date: req.body.endDate,
    question_real_answer: req.body.answer
  };
  const questionDates = {
    startDate: req.body.startDate,
    endDate: req.body.endDate
  };
  validateQuestionDates(question, questionDates, res);
}

function getQuestionsList(req, res){
  const page = req.swagger.params.page.value || 1;
  var q = Question.query().
  select('question_id as id', 'question_content as content',
         'question_created_date as startDate',
         'question_end_date as endDate',
         'question_status as status').
  whereRaw("" +
           (!req.swagger.params.lastId)? "true" :
           knex.raw("id > ?", req.swagger.params.lastId.value)).
  limit(constants.questionsPerPage).
  offset(constants.questionsPerPage*(page - 1)).
  orderBy('endDate');
  q.then(questions => res.status(200).send(questions));
}

module.exports = {
  getTriviaInfo: getTriviaInfo,
  createQuestion: createQuestion,
  getQuestionsList: getQuestionsList
};

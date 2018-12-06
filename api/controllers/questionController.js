'use strict';

const queryHelpers = require('../helpers/queryHelpers');
const Question = require('../models/Question');
const constants = require('../helpers/constants');
const knex = require('../../config/triviaDBConnection').knex;

const dateComparatorStringBuilder = (dateField, booleanOperator, dateValue, sign) =>
  `(${dateField} ${booleanOperator} (date((${dateValue})) ${sign} ` +
  `${constants.daysBetweenQuestions}))`;

const dateSubQueryBuilder = (dateField, id) => 
      Question.query.
      select(dateField).
      where('question_id', id).
      toString();

const dateFiller = (question, dateField) => `'${question[dateField]}'` ||
      dateSubQueryBuilder(dateField, question.question_id);

function getTriviaInfo(req, res) {
  queryHelpers.getCurrentQuestion.
  then(question => res.json({
    content: question[0].content,
    endDate: question[0].endDate
  }));
}

function updateQuestion(question, res){
  Question.query().
  update(question).
  where('question_id', question.question_id).
  andWhere(function(){
      this.whereRaw(`date((${question.question_start_date})) <= ` +
                    `date((${question.question_end_date}))`);  
    }
  ).
  then(rows => {
    
    if (rows)
      res.status(200).send({id: parseInt(question.question_id)});
    
    else
      res.status(500).send({message: "An error ocurred"});
  }).
  catch(() => res.status(500).send({message: "An error ocurred"}));
}

function insertQuestion(question, res){
  
  if ((new Date(question.question_end_date)) >= (new Date(question.question_start_date)))
    Question.query().insert(question).
    then(question => {
      
      if (question)
        res.status(201).send({id: question.id});
      
      else
        res.status(500).send({message: "An error ocurred"});
    }).
    catch(() => res.status(500).send({message: "An error ocurred"}));
  
  else
    res.status(412).send({message: "Dates not allowed"});
}

function validateQuestionDates(question, questionOperation, dates, res){
  var questionValidator = Question.query().
  select().
  whereRaw(`not (
    ${dateComparatorStringBuilder('question_end_date', '<',
                                  dates.startDate, '-')}
    or ${dateComparatorStringBuilder('question_start_date', '>',
                                     dates.endDate, '+')}
  )`);
  questionValidator = (!question.question_id)? questionValidator :
    questionValidator.andWhere('question_id', '!=', question.question_id);
  questionValidator.
  then(questions => {
    
    if (questions.length > 0)
      res.status(412).send({message: "Dates collision."});
    
    else
      questionOperation(question, res);
  });
}

function manageQuestion(req, res){
  const question = {
    question_content: req.body.content,
    question_start_date: req.body.startDate,
    question_end_date: req.body.endDate,
    question_real_answer: req.body.answer,
    question_id: req.body.id
  };
  const dates = {
    startDate: dateFiller(question, 'question_start_date'),
    endDate: dateFiller(question, 'question_end_date'),
  };
  const questionOperation = question.id? updateQuestion : insertQuestion;
  validateQuestionDates(question, questionOperation, dates, res);
}

function getQuestionsList(req, res){
  const page = req.swagger.params.page.value || 1;
  Question.query().
  select('question_id as id', 'question_content as content',
         'question_start_date as startDate',
         'question_end_date as endDate',
         'question_status as status').
  whereRaw("" +
           (!req.swagger.params.lastId)? "true" :
           knex.raw("id > ?", req.swagger.params.lastId.value)).
  limit(constants.questionsPerPage).
  offset(constants.questionsPerPage*(page - 1)).
  orderBy('endDate').
  then(questions => {
    questions.map(question => {
      question.startDate = question.startDate.toISOString().split('T')[0];
      question.endDate = question.endDate.toISOString().split('T')[0];
    });
    res.status(200).send(questions);
  }).
  catch(() => res.status(500).send({message: "Error ocurred"}));
}

module.exports = {
  getTriviaInfo: getTriviaInfo,
  manageQuestion: manageQuestion,
  getQuestionsList: getQuestionsList
};

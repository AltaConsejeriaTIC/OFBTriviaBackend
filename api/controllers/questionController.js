'use strict';

const Question = require('../models/Question');
const Answer = require('../models/Answer');
const constants = require('../helpers/constants');
const knex = require('../../config/triviaDBConnection').knex;
const helpers = require('../helpers/helpers');
const cron = require('node-cron');

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

const fromDatetimeToDateFormat = dateTime => dateTime.toISOString().split('T')[0];

function formatQuestionToSend(question){
	console.log(question);
	return {
		id: question.question_id,
    createdDate: fromDatetimeToDateFormat(question.question_created_date),
    content: question.question_content,
    answer: question.question_real_answer,
    startDate: fromDatetimeToDateFormat(question.question_start_date),
    endDate: fromDatetimeToDateFormat(question.question_end_date),
    status: question.question_status,
    active: Boolean(question.question_active),
		answersCount: question.answers_qty
	};
}

function updateQuestion(question, res){
  Question.query().
  update(question).
  where('question_id', question.question_id).
  then(rows => {
    
    if (rows)
      res.status(200).send({id: parseInt(question.question_id)});
    
    else
			helpers.sendError(res);
  }).
  catch(() => helpers.sendError(res));
}

function insertQuestion(question, res){
  if ((new Date(question.question_end_date)) >= (new Date(question.question_start_date)))
    Question.query().insert(question).
    then(question => {
      
      if (question)
        res.status(201).send({id: question.id});
      
      else
        helpers.sendError(res);
    }).
    catch(() => helpers.sendError(res));
  
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
  )`).
	andWhere('question_active', true);
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
		question_active: req.body.active,
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
  const questionOperation = (question.question_id)? updateQuestion : insertQuestion;
  validateQuestionDates(question, questionOperation, dates, res);
}

function getQuestionsList(req, res){
  const page = req.swagger.params.page.value || 1;
	const answersCount = Answer.query().
			count('answer_question').
			where('answer_question', knex.raw('??', ['question_id'])).
			as('answersCount');
  Question.
	query().
  select('question_id as id', 'question_content as content',
         'question_start_date as startDate',
         'question_end_date as endDate',
         'question_status as status',
				 'question_real_answer as answer',
				 answersCount
				 ).
  whereRaw("" +
           (!req.swagger.params.lastId)? "true" :
           knex.raw("id > ?", req.swagger.params.lastId.value)).
	andWhere('question_active', true).
  limit(constants.questionsPerPage).
  offset(constants.questionsPerPage*(page - 1)).
  orderBy('endDate').
	then(questions => {
    questions.map(question => {
      question.startDate = fromDatetimeToDateFormat(question.startDate);
      question.endDate = fromDatetimeToDateFormat(question.endDate);
    });
    res.status(200).send(questions);
  }).
	catch(() => helpers.sendError(res));
}

function getQuestion(req, res){
  Question.query().
  select().
  where('question_id', req.swagger.params.id.value).
  first().
  then(question => {
    const result = (question)? formatQuestionToSend(question) :
          {};
    res.status(200).send(result);
  }).
  catch(() => helpers.sendError(res));
}

function setQuestionAsFinished(){
	
	return Question.
	query().
	whereRaw('question_end_date <= CURDATE() - 3').
	andWhere(function() {
		this.
		where('question_status', 'Pendiente publicacion ganadores').
		orWhere('question_status', 'Mostrando ganadores');
	}).
	update({'question_status': 'Terminada'});
}

function setQuestionAsShowingWinners(){
	
	return Question.
	query().
	whereRaw('question_end_date = CURDATE() - 1').
	andWhere('question_selected_winners', true).
	andWhere('question_status', 'Publicada').
	update({'question_status': 'Mostrando ganadores'});
}

function setQuestionAsPendingWinners(){
	
	return Question.
	query().
	whereRaw('question_end_date = CURDATE() - 1').
	andWhere('question_selected_winners', false).
	andWhere('question_status', 'Publicada').
	update({'question_status': 'Pendiente publicacion ganadores'});
}

function setQuestionAsPublished(){
	
	return Question.
	query().
	whereRaw('question_start_date <= CURDATE()').
	andWhere(function(){
		this.whereRaw('question_end_date >= CURDATE()');
	}).
	andWhere('question_status', 'Programada').
	update({'question_status': 'Publicada'});
}

function updateQuestionsStates(req = null, res = null){
	knex.
	transaction(trx => {
		const updates = [
			setQuestionAsPublished().transacting(trx),
			setQuestionAsPendingWinners().transacting(trx),
			setQuestionAsShowingWinners().transacting(trx),
			setQuestionAsFinished().transacting(trx)
		];
		
		Promise.all(updates).
		then(() => {
			trx.commit();
			
			if (res)
				res.status(200).send({message: "Transaction done."});
		}).
		catch(e => {
			trx.rollback();
			console.log(e);
			if (res){
				helpers.sendError(res);
			}
		});
	});
}

cron.schedule('0 * * * *', () => {
	updateQuestionsStates(null, null);
});

function markQuestionAsSelectedWinners(questionId, transaction, res){
	Question.
	query().
	update({'question_selected_winners': 1}).
	where('question_id', questionId).
	then(() => {
			res.status(200).send({message: "Transaction done."});
	}).
	catch(() => helpers.sendError(res));
}

module.exports = {
  manageQuestion: manageQuestion,
  getQuestionsList: getQuestionsList,
  getQuestion: getQuestion,
	markQuestionAsSelectedWinners: markQuestionAsSelectedWinners,
	updateQuestionsStates: updateQuestionsStates
};

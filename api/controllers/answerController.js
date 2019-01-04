'use strict';

const Answer = require('../models/Answer');
const sendError = require('../helpers/helpers').sendError;
const knex = require('../../config/triviaDBConnection').knex;
const {markQuestionAsSelectedWinners} = require('./questionController');

function updateAnswer(citizenId, questionId, answer){
	
	return Answer.query().
				 where('answer_citizen', citizenId).
				 andWhere('answer_question', questionId).
				 update(answer);
}

function getAnswersList(req, res){
	Answer.query().
	select('answer_citizen as userId', 'answer_content as content',
				 'answer_date as date', 'answer_score as score', 'answer_winner as winner').
	where('answer_question', req.swagger.params.questionId.value).
	orderBy('score', 'DESC').
	orderBy('date').
	then(answers => {
		answers.map(answer => {
			answer.date.setTime(answer.date.getTime() - answer.date.getTimezoneOffset()*60*1000);
		});
		res.status(200).send(answers);
	}).
  catch(() => sendError(res));
}

function selectWinners(req, res){
	knex.transaction(trx => {
		var updates = [];
		req.body.map(winner => {
			updates.push(updateAnswer(winner.userId, winner.questionId,
																{answer_winner: true}, '', res).
									 transacting(trx));
		});
		
		Promise.all(updates).
		then(() => {
			trx.commit();
			markQuestionAsSelectedWinners(req.body[0].questionId, trx, res);
		}).
		catch(() => {
			trx.rollback();
			sendError(res);
		});
	});
}

module.exports = {
	getAnswersList: getAnswersList,
	selectWinners: selectWinners
};
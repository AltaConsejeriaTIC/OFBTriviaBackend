'use strict';

const Answer = require('../models/Answer');
const Citizen = require('../models/Citizen');
const sendError = require('../helpers/helpers').sendError;
const knex = require('../../config/triviaDBConnection').knex;

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
	orderBy('date').
	then(answers => res.status(200).send(answers)).
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
			res.status(200).send({message: "Transaction done."});
		}).
		catch(() => {
			trx.rollback();
			sendError(res);
		});
	});
}

function getContactInfo(req, res){
	Citizen.query().
	select('citizen_email as email',
				 'citizen_cellphone as cellphone',
				 'citizen_name as name',
				 'citizen_last_name as lastName',
				 'citizen_contact_media as contactPreference').
	joinRelation('[answers]').
	where('answers.answer_question', req.swagger.params.questionId.value).
	then(citizensInfo => res.status(200).send(citizensInfo)).
	catch(() => sendError(res));
}

module.exports = {
	getAnswersList: getAnswersList,
	selectWinners: selectWinners,
	getContactInfo: getContactInfo
};
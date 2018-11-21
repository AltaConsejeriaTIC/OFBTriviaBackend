'use strict';

const Answer = require('../models/Answer');
const Citizen = require('../models/Citizen');
const queryHelpers = require('../helpers/queryHelpers');
const helpers = require('../helpers/helpers');

function insertAnswer(citizenId, questionId, answer, citizenMessage, res){
	Answer.query().
	insert({
		answer_question: questionId,
		answer_citizen: citizenId,
		answer_content: answer
	}).
	then(() => res.status(200)({message: `answer created, ${citizenMessage}`})).
	catch(e => console.log(e));
}

function updateAnswer(citizenId, questionId, answer, citizenMessage, res){
	Answer.query().
	where('answer_citizen', citizenId).
	andWhere('answer_question', questionId).
	update({answer_content: answer}).
	then(() => res.json(`answer updated, ${citizenMessage}`)).
	catch(e => console.log(e));
}

function manageAnswer(citizenId, questionId, answerContent, citizenMessage, res){
	Answer.query().
	select().
	where('answer_citizen', citizenId).
	andWhere('answer_question', questionId).
	then(answer => {
		var operationOnAnswer = (answer)? updateAnswer : insertAnswer;
		operationOnAnswer(citizenId, questionId, answerContent, citizenMessage, res);
	});
}

function updateCitizen(citizenId, params, questionId, res){
	Citizen.query().
	where('citizen_id', citizenId).
	update(helpers.formatRawCitizenData(params)).
	then(() => manageAnswer(citizenId, questionId, params.answer, 'user info updated', res)).
	catch(e => console.log(e));
}

function insertCitizen(params, questionId, res){
	Citizen.query().
	insert(helpers.formatRawCitizenData(params)).
	then(citizen => insertAnswer(citizen.id, questionId, params.answer, 'user info updated', res)).
	catch(e => console.log(e));
}

function processCitizen(params, questionId, res){
	Citizen.query().
	select().
	where('citizen_email', params.email).
	orWhere('citizen_cellphone', params.cellphone).
	then(citizen =>
		helpers.runFunctionByCondition(Boolean(citizen[0]), updateCitizen,
																	 [citizen[0].citizen_id, params, questionId, res],
																	 insertCitizen, [params, questionId, res]));
}

function uploadAnswer(req, res){
	queryHelpers.getCurrentQuestion.
	then(question =>
		helpers.runFunctionByCondition(Boolean(question[0]), processCitizen,
																	 [req.body, question[0].id, res], res.status(503).send,
																	 [{message: "there's no trivia at the moment"}]));
}

module.exports = {
	uploadAnswer: uploadAnswer
};
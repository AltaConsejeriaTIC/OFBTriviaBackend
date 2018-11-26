'use strict';

const Answer = require('../models/Answer');
const processCitizen = require('./citizenController').processCitizen;
const queryHelpers = require('../helpers/queryHelpers');

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

function uploadAnswer(req, res){
	queryHelpers.getCurrentQuestion.
	then(question => {
		
		if (question[0])
			processCitizen(req.body, question[0].id, insertAnswer, manageAnswer, res);
		
		else 
			res.status(503).send({message: "there's no trivia at the moment"});
	});
}

function getAnswersList(req, res){
	Answer.query().
	select('answer_citizen as userId', 'answer_content as content',
				 'answer_date as date', 'answer_score as score').
	where('answer_question', req.swagger.params.questionId.value).
	orderBy('date').
	then(answers => res.status(200).send(answers));
}

module.exports = {
	uploadAnswer: uploadAnswer,
	getAnswersList: getAnswersList
};
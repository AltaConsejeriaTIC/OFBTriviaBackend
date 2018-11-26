'use strict';

const Answer = require('../models/Answer');
const processCitizen = require('./citizenController').processCitizen;
const queryHelpers = require('../helpers/queryHelpers');

function insertAnswer(citizenId, questionId, answer){
	
	return Answer.query().
	insert({
		answer_question: questionId,
		answer_citizen: citizenId,
		answer_content: answer
	});
}

function updateAnswer(citizenId, questionId, answer){
	
	return Answer.query().
				 where('answer_citizen', citizenId).
				 andWhere('answer_question', questionId).
				 update(answer);
}

function manageAnswer(citizenId, questionId, answerContent, citizenMessage, res){
	Answer.query().
	select().
	where('answer_citizen', citizenId).
	andWhere('answer_question', questionId).
	then(answer => {
		var operationOnAnswer = (answer)? updateAnswer : insertAnswer;
		var operationArgs = (answer)? [citizenId, questionId, {answer_content: answerContent}] :
												[citizenId, questionId, answerContent];
		operationOnAnswer(...operationArgs).
		then(() => res.status(200).send({message: `answer updated, ${citizenMessage}`})).
		catch(e => console.log(e));
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

function selectWinners(req, res){
	var updates = [];
	
	for (const winner of req.winners)
		updates.push(updateAnswer(winner.citizenId, winner.questionId,
								 {answer_winner: true}, '', res));
}

module.exports = {
	uploadAnswer: uploadAnswer,
	getAnswersList: getAnswersList
};
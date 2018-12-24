'use strict';

const Citizen = require('../models/Citizen');
const Question = require('../models/Question');
const helpers = require('../helpers/helpers');
const constants = require('../helpers/constants');

function formatCitizenToSend(citizen){
	
	return {
		id: citizen.citizen_id,
		name: citizen.citizen_name,
		lastName: citizen.citizen_last_name,
		email: citizen.citizen_email,
		contactPreference: citizen.contact_media,
		cellphone: citizen.citizen_cellphone
	};
}

function updateCitizen(citizenId, params){
	
  return Citizen.query().
         where('citizen_id', citizenId).
         update(helpers.formatRawCitizenData(params));
}

function insertCitizen(params){
	
  return Citizen.query().
          insert(helpers.formatRawCitizenData(params));
}

function processCitizen(params, questionId, insertAnswer, manageAnswer, res){
	Citizen.query().
	where('citizen_email', params.email).
	orWhere('citizen_cellphone', params.cellphone).
	then(citizen => {
		
		if (citizen[0]){
      updateCitizen(citizen[0].citizen_id, params).
      then(() => manageAnswer(citizen[0].citizen_id, questionId, params.answer,
                              'user updated', res)).
			catch(() => helpers.sendError(res));
    }
		else
			insertCitizen(params).
      then(newCitizen => insertAnswer(newCitizen.id, questionId,
                                      {answer_content: params.answer}, 'user created', res)).
			catch(() => helpers.sendError(res));
	});
}

function getWinners(req, res) {
  var previousQuestion = Question.
    query().
    select('question_end_date').
    whereRaw('question_end_date <= CURDATE()').
    orderBy('question_end_date', 'desc').
    limit(1);
  
  Citizen.
  query().
  select('citizen_name as name', 'citizen_last_name as lastName', 'question_end_date as date').
  joinRelation('questions').
  whereRaw(`question_end_date = (${previousQuestion.toString()})`).
  andWhere('answer_winner', '=', true).
  then(winners => {
    const result = (winners.length  > 0)? {
        date: winners[0].date,
        winners: winners.map(winner => `${winner.name} ${winner.lastName}`)
      } :
      {};
    
    res.status(200).send(result);
  }).
  catch(() => helpers.sendError(res));
}

function getCitizen(req, res){
	Citizen.query().
	select().
	where('citizen_id', req.swagger.params.id.value).
	then(citizen => res.status(200).send(formatCitizenToSend(citizen[0]))).
	catch(() => res.status(500).send(constants.errorMessage));
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
	catch(() => helpers.sendError(res));
}

module.exports = {
  getWinners: getWinners,
  processCitizen: processCitizen,
  getUser: getCitizen,
	getContactInfo: getContactInfo
};

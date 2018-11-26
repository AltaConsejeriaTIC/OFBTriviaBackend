'use strict';

const Citizen = require('../models/Citizen');
const Question = require('../models/Question');
const helpers = require('../helpers/helpers');

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
	select().
	where('citizen_email', params.email).
	orWhere('citizen_cellphone', params.cellphone).
	then(citizen => {
		
		if (citizen[0])
			updateCitizen(citizen[0].citizen_id, params).
      then(() => manageAnswer(citizen[0].citizen_id, questionId,
                              params.answer, 'user info updated', res)).
      catch(e => console.log(e));
		
		else
			insertCitizen(params).
      then(newCitizen => insertAnswer(newCitizen[0].citizen_id, questionId,
                                   params.answer, 'user created', res)).
      catch(e => console.log(e));
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
  then(winners => res.json({
    date: winners[0].date,
    winners: winners.map(winner => `${winner.name} ${winner.lastName}`)
  }));
}

module.exports = {
  getWinners: getWinners,
  processCitizen: processCitizen
};

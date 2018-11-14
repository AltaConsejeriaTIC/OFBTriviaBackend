'use strict';

const Citizen = require('../models/Citizen');
const Question = require('../models/Question');

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

function insertCitizen(name, lastName, email, cellphone, contactMedia, allowsContact){
  
  return Citizen.query().insert({
				email: email,
				name: name,
				lastName: lastName,
				allowsContact: allowsContact,
				cellphone: cellphone,
				contactMedia: contactMedia
  });
}

module.exports = {
  getWinners: getWinners,
  insertCitizen: insertCitizen
};

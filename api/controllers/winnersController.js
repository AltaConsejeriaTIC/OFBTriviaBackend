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
  select('citizen_name as name', 'citizen_last_name as lastName').
  joinRelation('questions').
  whereRaw(`question_end_date = (${previousQuestion.toString()})`).
  andWhere('answer_winner', '=', true).
  then(winners => res.json(winners.map(winner => `${winner.name} ${winner.lastName}`)));
}

module.exports = {
  getWinners: getWinners
};

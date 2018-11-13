'use strict';

const Question = require('../models/Question');

function getTriviaInfo(req, res) {
  Question.
  query().
  select('question_content as content', 'question_end_date as endDate').
  whereRaw('question_start_date <= CURDATE() and question_end_date > CURDATE()').
  then(question => res.json(question[0]));
}

module.exports = {
  getTriviaInfo: getTriviaInfo
};

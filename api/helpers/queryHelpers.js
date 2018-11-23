'use strict';

const Question = require('../models/Question');

var getCurrentQuestion = Question.
		query().
		select('question_content as content', 'question_end_date as endDate', 'question_id as id').
		whereRaw('question_start_date <= CURDATE() and question_end_date > CURDATE()');

module.exports = {
	getCurrentQuestion: getCurrentQuestion
};
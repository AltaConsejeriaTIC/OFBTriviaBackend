'use strict';

const Model = require('../../config/triviaDBConnection').Model;


class Question extends Model{
	
	static get tableName(){
		
		return 'questions';
	}
	
	static get relationMappings(){
		
		return {
				citizens: {
				relation: Model.ManyToManyRelation,
				modelClass: __dirname + '/Citizen',
				join: {
					from: 'questions.question_id',
					through: {
						from: 'answers.answer_question',
						to: 'answers.answer_citizen'
					},
					to: 'citizens.citizen_id'
				}
			},
			
			answers: {
				relation: Model.HasManyRelation,
				modelClass: __dirname + '/Answer',
				join: {
					from: 'questions.question_id',
					to: 'answers.answer_question'
				}
			}
		};
	}
}


module.exports = Question;
'use strict';

const Model = require('../../config/triviaDBConnection');


class Question extends Model{
	
	static get tableName(){
		
		return 'questions';
	}
	
	static get jsonSchema(){
		
		return {
			type: 'object',
			required: ['content', 'startDate', 'endDate', 'realAnswer'],
			
			properties: {
				id: {type: 'integer'},
				content: {type: 'string'},
				startDate: {type: 'string'},
				endDate: {type: 'string'},
				realAnswer: {type: 'string'},
				publishedDate: {type: 'string'}
			}
		};
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
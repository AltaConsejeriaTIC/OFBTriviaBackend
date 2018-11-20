'use strict';

const Model = require('../../config/triviaDBConnection');


class Citizen extends Model{
	
	static get tableName(){
		
		return 'citizens';
	}
	
	static get relationMappings(){
		
		return {
				questions: {
				relation: Model.ManyToManyRelation,
				modelClass: __dirname + '/Question',
				join: {
					from: 'citizens.citizen_id',
					through: {
						from: 'answers.answer_citizen',
						to: 'answers.answer_question'
					},
					to: 'questions.question_id'
				}
			},
			
			answers: {
				relation: Model.HasManyRelation,
				modelClass: __dirname + '/Answer',
				join: {
					from: 'citizens.citizen_id',
					to: 'answers.answer_citizen'
				}
			}
		};
	}
}


module.exports = Citizen;
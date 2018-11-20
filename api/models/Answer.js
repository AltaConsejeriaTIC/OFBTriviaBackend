'use strict';

const Model = require('../../config/triviaDBConnection');


class Answer extends Model{	
	
	static get tableName(){
		
		return 'answers';
	}
	
	static get relationMappings(){
		
		return {
			question: {
				relation: Model.BelongsToOneRelation,
				modelClass: __dirname + '/Question',
				join: {
					from: 'answers.answer_question',
					to: 'questions.question_id'
				}
			},
			
			citizen: {
				relation: Model.BelongsToOneRelation,
				modelClass: __dirname + '/Citizen',
				join: {
					from: 'answers.answer_citizen',
					to: 'citizens.citizen_id'
				}
			}
		};
	}
}


module.exports = Answer;
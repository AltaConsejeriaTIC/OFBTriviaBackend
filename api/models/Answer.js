'use strict';

const Model = require('../../config/triviaDBConnection').Model;


class Answer extends Model{	
	
	static get tableName(){
		
		return 'answers';
	}
	
	static get jsonSchema(){
		
		return {
			type: 'object',
			required: ['citizenId', 'questionId', 'content','date'],
			
			properties: {
				citizenId: {type: 'string'},
				questionId: {type: 'string'},
				content: {type: 'string'},
				date: {type: 'string'},
				score: {type: 'number'},
				isAWinner: {type: ['boolean', 'null']}
			}
		};
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
				modelClass: __dirname + '/Question',
				join: {
					from: 'answers.answer_citizen',
					to: 'citizens.citizen_id'
				}
			}
		};
	}
}


module.exports = Answer;
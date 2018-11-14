'use strict';

const Answer = require('../models/Answer');
const insertCitizen = require('./citizenController').insertCitizen;

function uploadAnswer(req, res){
	var params = req.swagger.params;
	var c = insertCitizen(params.name.value, params.lastName.value,
												params.email.value, params.cellphone.value,
												params.contactPreference.value, params.allowContac.value);
	console.log(c);
}

module.exports = {
	uploadAnswer: uploadAnswer
};
'use strict';

const bcrypt = require('bcrypt');
const constants = require('../helpers/constants');

const sendError = (res) => res.status(500).send(constants.errorMessage);

function createConditionedElements(ifTrueElement, ifFalseElement){
	
	return {
		true: ifTrueElement,
		false: ifFalseElement
	};
}

function runFunctionByCondition(condition, ifTrueFunction, ifTrueArgs,
																ifFalseFunction, ifFalseArgs){
	var functions = createConditionedElements(ifTrueFunction, ifFalseFunction);
	var args = createConditionedElements(ifTrueArgs, ifFalseArgs);
	
	return functions[condition](...args[condition]);
}

function formatRawCitizenData(rawData){
	
	return {
		citizen_email: rawData.email,
		citizen_cellphone: rawData.cellphone,
		citizen_name: rawData.name,
		citizen_last_name: rawData.lastName,
		citizen_contact_media: rawData.contactPreference
	};
}

function formatAdminData(rawData){
	var formatedAdmin = {};
	
	for (const key of Object.keys(rawData))
		formatedAdmin[constants.adminFields[key]] = (key != "password")? rawData[key]
					: bcrypt.hashSync(rawData[key], 10);
	
	return formatedAdmin;
}

module.exports = {
	formatRawCitizenData: formatRawCitizenData,
	formatAdminData: formatAdminData,
	runFunctionByCondition: runFunctionByCondition,
	sendError: sendError
};
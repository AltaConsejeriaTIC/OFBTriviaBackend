'use strict';

const bcrypt = require('bcrypt');
const constants = require('../helpers/constants');

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
	
	for (const key in rawData)
		formatedAdmin[constants.adminFields[key]] = (key != "password")? rawData[key]
					: bcrypt.hashSync(rawData[key], 10);
		
	
	return formatedAdmin;
}

module.exports = {
	formatRawCitizenData: formatRawCitizenData,
	formatAdminData: formatAdminData
};
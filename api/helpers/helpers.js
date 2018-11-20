'use strict';

function formatRawCitizenData(rawData){
	
	return {
		citizen_email: rawData.email,
		citizen_cellphone: rawData.cellphone,
		citizen_name: rawData.name,
		citizen_last_name: rawData.lastName,
		citizen_contact_media: rawData.contactPreference
	};
}

module.exports = {
	formatRawCitizenData: formatRawCitizenData
};
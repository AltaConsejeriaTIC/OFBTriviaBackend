
const daysBetweenQuestions = 2;
const questionsPerPage = 4;
const errorMessage = {
	message: 'An error has ocurred.'
};
const adminFields = {
	email: "admin_email",
	name: "admin_name",
	lastName: "admin_last_name",
	password: "admin_password",
	userName: "admin_account_name",
	active: "admin_is_active"
};

module.exports = {
	adminFields: adminFields,
	daysBetweenQuestions: daysBetweenQuestions,
	questionsPerPage: questionsPerPage,
	errorMessage: errorMessage
};
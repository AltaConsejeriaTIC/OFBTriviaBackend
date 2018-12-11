'use strict';

const daysBetweenQuestions = 2;
const questionsPerPage = 4;
const errorMessage = {
	message: 'An error has ocurred.'
};
const adminFields = {
	email: 'admin_email',
	name: 'admin_name',
	lastName: 'admin_last_name',
	password: 'admin_password',
	userName: 'admin_account_name',
	active: 'admin_is_active'
};
const videoFields = {
	id: 'video_id',
	title: 'video_title',
	channel: 'video_author',
	url: 'video_url',
	time: 'video_total_time',
	thumbnail: 'video_thumbnail',
	selected: 'video_selected'
};
const audioFields = {
	title: 'audio_title',
	artist: 'audio_artist',
	url: 'audio_url',
	id: 'audio_id'
};
const questionFields = {
	id: 'question_id',
	createdDate: 'question_created_date',
	content: 'question_contet',
	answer: 'question_real_answer',
	startDate: 'question_start_date',
	endDate: 'question_end_date',
	status: 'question_status',
	active: 'question_active'
};

module.exports = {
	videoFields: videoFields,
	adminFields: adminFields,
	audioFields: audioFields,
	daysBetweenQuestions: daysBetweenQuestions,
	questionsPerPage: questionsPerPage,
	errorMessage: errorMessage,
	questionsFields: questionFields
};
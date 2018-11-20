'use strict';

const queryHelpers = require('../helpers/queryHelpers');

function getTriviaInfo(req, res) {
  queryHelpers.getCurrentQuestion.
  then(question => res.json({
    content: question[0].content,
    endDate: question[0].endDate
  }));
}

module.exports = {
  getTriviaInfo: getTriviaInfo
};

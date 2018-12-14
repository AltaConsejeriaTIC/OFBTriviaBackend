'use strict';

const fileUpload = require('express-fileupload');
var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
app.use(fileUpload());
module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 10011;
  app.listen(port);

  if (swaggerExpress.runner.swagger.paths['/questions-list']) {
    console.log('\n\nServer up and running in http://127.0.0.1:' + port + '\n\n');
  }
});

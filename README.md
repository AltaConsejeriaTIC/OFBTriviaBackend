# OFB APP

API server powered by Swagger.

To install Swagger to be used trhrough the command line.
`sudo npm install -g swagger`

After it's installed run in the root of this project `knex --knexfile config/triviaDBParameters.js migrate:latest` to create the database tables and `swagger project edit` to work wih the API editor, or `swagger project start` to start the server.

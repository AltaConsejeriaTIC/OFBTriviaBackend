
module.exports = {
  
  development: {
    client: '',
    connection: {
      host: '',
      port: '',
      user: '',
      password: '',
      database: ''
    }
  },

  production: {
    client: 'mysql',
    connection: {
      host: '165.227.254.52',
      port: '3306',
      user: 'root',
      password: 'root',
      database: 'filarmon_trivia'
    }
  }
};

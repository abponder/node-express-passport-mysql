var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

  var mysql = require('mysql');
  var bcrypt = require('bcryptjs');

  require('dotenv').config();
  //var connection = mysql.createConnection(dbconfig.connection);
  var connection = mysql.createConnection({
      'host': process.env.host,
      'user': process.env.user,
      'password': process.env.password
  });

  connection.query('USE ' + process.env.database);


  module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
      done(null, user.id);
    });
    
    passport.deserializeUser(function(id, done) {
      connection.query("SELECT * FROM users WHERE id = ? ",[id], function(err, rows){
        done(err, rows[0]);
    });
    });
    passport.use(new LocalStrategy(
      function(username, password, done) {

        connection.query(`SELECT * FROM users WHERE username = '${username}'`, function(err, rows) {
            console.log(err, rows)
            if(!rows.length){
              return done(null,false,'')
            }
        })
      }
    ));
  }



















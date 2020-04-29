const LocalStrategy   = require('passport-local').Strategy;
const mysql = require('mysql');
const bcrypt = require('bcrypt-nodejs');
require('dotenv').config();
var connection = mysql.createConnection({
    'host': process.env.host,
    'user': process.env.user,
    'password': process.env.password
});
connection.query('USE ' + process.env.database);


// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        connection.query("SELECT * FROM users WHERE id = ? ",[id], function(err, rows){
            done(err, rows[0]);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-signup',
        new LocalStrategy({
          // by default, local strategy uses username and password, we will override with email
          usernameField : 'username',
          passwordField : 'password',
          // passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(username, password, done) {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            connection.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows) {
                if (err) return done(err);
                if (rows.length) {
                  return done(null, false, {err: true, msg: 'That username is already taken.'});
                } else {
                  // if there is no user with that username, create the user
                  const newUser = {
                    username: username,
                    password: bcrypt.hashSync(password, null, null)  // use the generateHash function in our user model
                  };
  
                  connection.query(`INSERT INTO users (username, password) values ('${newUser.username}', '${newUser.password}')`, (err, rows) => {
                    if (err) return done(err);
                    newUser.id = rows.insertId;
                    return done(null, newUser);
                  });
                }
            });
        })
    );

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-login',
        new LocalStrategy({
          // by default, local strategy uses username and password, we will override with email
          usernameField : 'username',
          passwordField : 'password',
          passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) { // callback with email and password from our form
            connection.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows){
                if (err) return done(err);
                if (!rows.length) {
                  return done(null, false, {err: true, msg: 'No user found.'});
                }

                // if the user is found but the password is wrong
                if (!bcrypt.compareSync(password, rows[0].password)) {
                  return done(null, false, {err: true, msg: 'Oops! Wrong password.'});
                }
            
                // all is well, return successful user
                return done(null, rows[0]);
            });
        })
    );
};





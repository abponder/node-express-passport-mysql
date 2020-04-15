// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var mysql = require('mysql');
var bcrypt = require('bcryptjs');
//var dbconfig = require('./database');
require('dotenv').config();
//var connection = mysql.createConnection(dbconfig.connection);
var connection = mysql.createConnection({
    'host': process.env.host,
    'user': process.env.user,
    'password': process.env.password
});

// connection.connect();
//connection.query('USE ' + dbconfig.database);
connection.query('USE ' + process.env.database);
// connection.end();
// expose this function to our app using module.exports
module.exports = function(passport) {
    
    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        console.log('serializeUser:', user)
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        // connection.connect();
        console.log('deserializeUser:',id)
        connection.query("SELECT * FROM users WHERE id = ? ",[id], function(err, rows){
            done(err, rows[0]);
        });
        // connection.end();
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
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            
            // connection.connect();
           
            connection.query(`SELECT * FROM users WHERE username = '${username}'`, function(err, rows) {
                
                if (err)
                
                    return done(err);
                if (rows.length) {
                    return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                } else {
                    // if there is no user with that username
                    // create the user
                    
                    var newUserMysql = {
                        username: username,
                        password: bcrypt.hashSync(password, null, null)  // use the generateHash function in our user model
                    };
                    
                    var insertQuery = "INSERT INTO users ( username, password ) values (?,?)";
                    // connection.connect();
                    connection.query(insertQuery,[newUserMysql.username, newUserMysql.password],function(err, rows) {
                        newUserMysql.id = rows.insertId;

                        return done(null, newUserMysql);
                    });
                    // connection.end();
                }
            });
            // connection.end();
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
            
        //     connection.connect();
            connection.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows){
                if (err)
                    return done(err);
                if (!rows.length) {
                    //return done(null, {});
                    // res.locals.flash = req.flash('loginMessage');
                    
                    // return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                    req.flash('loginMessage', 'Oops! unable to validate user name or password.')  //set the message
                    return done (null, false, req.flash('loginMessage')) //get the message
                    //check next time: make sure the success user found option is used; add routes error function
                }

                // if the user is found but the password is wrong
                if (!bcrypt.compareSync(password, rows[0].password)){
                    req.flash('loginMessage', 'Oops! unable to validate user name or password.')  //set the message
                    return done (null, false, req.flash('loginMessage')) //get the message
                }
                console.log(rows[0])
                console.log('req.session passport.js',req.session)
                req.session.passport = {id: rows[0].id}
                return done(null, rows[0]);

            });
            // connection.end();
        })
    );
};



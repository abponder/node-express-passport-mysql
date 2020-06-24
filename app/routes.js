require('dotenv').config();
const mysql = require('mysql');
var connection = mysql.createConnection({
    'host': process.env.host,
    'user': process.env.user,
    'password': process.env.password
});
connection.query('USE ' + process.env.database);

// app/routes.js
module.exports = function(app, passport) {

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
		res.render('index.ejs'); // load the index.ejs file
	});

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

  // process the login form
  app.post('/api/login', (req, res, next) => {
    passport.authenticate('local-login', (err, user, info) => {
      if (err) return res.json({ err: true, msg: err.message });
      if (!user) return res.json(info);
      req.logIn(user, function(err) {
        if (err) return res.json({ err: true, msg: err.message });

        req.session.cookie.expires = false;
        return res.json({ err: false, user: user });
      });
    })(req, res, next);
  });

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

  // process the signup form
  app.post('/api/signup', (req, res, next) => {
    passport.authenticate('local-signup', (err, user, info) => {
      if (err) return res.json({ err: true, msg: err.message });
      if (!user) return res.json(info);
      req.logIn(user, function(err) {
        if (err) return res.json({ err: true, msg: err.message });
        return res.json({ err: false, user: user });
      });
    })(req, res, next);
  });

	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/api/welcome', isLoggedIn, function(req, res) {
		// if (err) return res.json({ err: true, msg: err.message });
    return res.json({ err: false, user: req.user });
	});

	app.get('/api/schedule', (req,res)=> {
		let results
		connection.query(`SELECT  meeting_id, meeting_title, DATE_FORMAT(start_date, "%M %D, %Y"), start_time, attendees, topics_discussed, status FROM meetings`, (err, rows, fields) => {
			if (err) console.log(err)
				console.log('its working !', rows)
				let formatedrows=rows.map(record => {
					return {
						meetingId:record.meeting_id,
						meetingTitle:record.meeting_title,
						startDate:record['DATE_FORMAT(start_date, "%M %D, %Y")'],
						startTime:record.start_time,
						attendees:record.attendees,
						topicsDiscussed:record.topics_discussed,
						status:record.status[0].toUpperCase() + record.status.slice(1)
	
					}
				})
			res.send(formatedrows)
			// results = rows
		})
	})

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.post('/api/logout', (req, res) => {
		req.logout()
		// res.json({ err: false, user: null });
		res.redirect("/")
  });
};

// route middleware to make sure
function isLoggedIn(req, res, next) {
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated()) {
    console.log('is authenticated',req.isAuthenticated() )
		console.log('req.session',req.session )
		return res.json({ err: false, user: req.user });
    // return next();
  } else {
    return res.json({ err: true, msg: 'Unable to authenticate user.' });
  }
}
 

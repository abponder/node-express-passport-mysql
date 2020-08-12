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
		connection.query(`SELECT  meeting_id, meeting_title, date_format(start_date, "%m/%d/%y") as start_date, start_time, attendees, topics_discussed, status FROM meetings`, (err, rows, fields) => {
			if (err) console.log(err)
				let formatedrows=rows.map(record => {
					console.log(record)
					return {
						meetingId:record.meeting_id,
						meetingTitle:record.meeting_title,
						// startDate:record.start_date.toString().slice(0,15),
						startDate:record.start_date,
						startTime:record.start_time,
						attendees:record.attendees,
						topicsDiscussed:record.topics_discussed,
						status:record.status
	
					}
				})
				console.log('its working !', formatedrows)
			res.send(formatedrows)
			// results = rows
		})
	})

	app.put('/api/edit', (req,res)=> {
		console.log('this is the data coming back', req.body)
		//changed to STR_TO_DATE, added ticks, put comma in! argh
		connection.query(`
			UPDATE meetings 
			SET meeting_title = '${req.body.meetingTitle}',  
			start_date = '${req.body.startDate}', 
			start_time = '${req.body.startTime}',
			attendees = '${req.body.attendees}',
			topics_discussed = '${req.body.topicsDiscussed}',
			status = '${req.body.status}'
			WHERE meeting_id = '${req.body.meetingId}'`, (err, result) => {
				console.log('err :',err)  
			console.log('new edit data', result)
		})
	
		res.send(req.body)
	
	})

	app.post('/api/add', (req,res)=> {
		console.log('this is the data coming back', req.body)
		//changed to STR_TO_DATE, added ticks, put comma in! argh
		connection.query(`
			INSERT INTO meetings (meeting_title, start_date, start_time, attendees, topics_discussed, status)
			VALUES ('${req.body.meetingTitle}',  
			'${req.body.startDate}', 
			'${req.body.startTime}',
			'${req.body.attendees}',
			'${req.body.topicsDiscussed}',
			'${req.body.status.length ? req.body.status : "Open"}')`, (err, result) => {
				console.log('err :',err)  
			console.log('new edit data', result)
			res.send(result)
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
 

// app/routes.js
module.exports = function(app, passport) {

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/api/login', function(req, res) {

		const resmsg = { messages: req.flash('loginMessage') }
		res.send({ message: req.flash('loginMessage') });

	});

	// =====================================
	// LOGIN ===============================
	// =====================================

// //process the login form
// 	app.post('/api/login', passport.authenticate('local-login', {
// 		successRedirect : '/', // redirect to the secure profile section
// 		failureRedirect : '/api/login', // redirect back to the signup page if there is an error
// 		failureFlash : true // allow flash messages
// }),
// function(req, res) {

// 		if (req.body.remember) {
// 			req.session.cookie.maxAge = 1000 * 60 * 3;
// 		} else {
// 			req.session.cookie.expires = false;
// 		}
// res.redirect('/');
// });

app.post('/api/login', function(req, res, next) {
  passport.authenticate('local-login', function(err, user, info) {
		res.json({
			'message': info ? info : "", //if info else send back empty string
			'user': user
		})
		

  })(req, res, next);
});



	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/api/signup', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/api/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}

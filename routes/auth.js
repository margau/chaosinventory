const express = require('express');
const router = express.Router();
const passport = require('passport');

// Login
router.get('/login', (req, res) => {
	// Redirect to home, if an user is already logged in
	if(req.user) {
		res.redirect('/');
		return;
	}
	const loginError = req.flash('error').toString();
	res.render('pages/login.ejs', {
    loginError: loginError
  });
});
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

// Logout
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;

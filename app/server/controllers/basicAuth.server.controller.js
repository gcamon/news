"use strict";

var config = require('../config');
var passport = config.passport;
var LocalStrategy = require("passport-local").Strategy;
var salt = require('../salt');
var path = require('path');
//var route = config.router;



module.exports = function(model,route) {

passport.use('signup', new LocalStrategy({
	usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true 
	},
	function(req,email,password,done){
		process.nextTick(function(){
			model.admin.findOne({email:email},function(err,user){
				if(err) return done(err);
				if(user){
					return done(null, false, req.flash('signupMessage', 'Email has already been used'));	
				} else {
					var newAdmin = new model.admin({
						firstname: req.body.firstname,
						lastname:  req.body.lastname,
						email: req.body.email,
						password: salt.createHash(password),
						deleted: false,
						profile_pic_url: "/download/profile_pic/nopic",
						super_admin: false,
						phone: req.body.phone
					})

					newAdmin.save(function(err,info){
						if(err) throw err;
						console.log("admin created!")
						return done(null,newAdmin);
					})
				}
			})
		})
}));


passport.use('user-login', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField : 'username',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function (req, username, password, done) {           
  	console.log(username,"=======" ,password)
    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists
    model.admin.findOne({ email :  username }, function(err, user) {
        
        // if there are any errors, return the error before anything else
        if (err) {
            return done(err);
        }
        // if no user is found, return the message
        if (!user) {
            return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
        }
        // if the user is found but the password is wrong
        if (!salt.isValidPassword(user,password)) {
            return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
        }
        
        //req.session.user = user;
        // all is well, return successful user
        return done(null, user);
    });

}));


route.get("/admin/login",function(req,res){
	res.render('login', { message: req.flash('signupMessage')});
})

route.get("/admin/signup",function(req,res){
	res.render('signup', { message: req.flash('signupMessage') });
})


route.post("/admin/signup",function(req,res,next){
	passport.authenticate('signup', function(err, user, info) {   
	    if (err) {
	      return next(err); // will generate a 500 error
	    }

	    console.log(user)
	    // Generate a JSON response reflecting signup
	    if (!user) {	
	      res.redirect('/admin/signup')
	    } else {
    		res.redirect('login');
	    }
	  })(req, res, next)
})


route.get("/auth",function(req,res){
	if(req.user){
		res.render("admin",{user: req.user});
	} else {
		res.redirect("/admin/login");
	}
});


route.post('/auth', passport.authenticate('user-login', {
  successRedirect : '/auth', // redirect to the secure profile section
  failureRedirect : '/failed', // redirect back to the signup page if there is an error
  failureFlash : true // allow flash messages
}));

route.get('/failed',function(req,res){        
  res.redirect('/admin/login');
});


route.get('/logout',function(req,res){
	req.logout();
  res.redirect('/admin/login');
});

}
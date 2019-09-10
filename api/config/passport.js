var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

passport.use(new LocalStrategy({
    usernameField: 'username'
},
    function(username, password, done){
        User.findOne({username: username}, function(err, user){
            if(err){
                console.log("***failed to check db for user: " + err);
                return done(err);}

            //return if user not found in db
            if(!user){
                return done(null, false, {
                    message: 'User not found'
                });
            }

            //return if pwd is wrong
            if(!user.validPassword(password)){
                return done(null, false, {
                    message: 'Password is wrong'
                });
            }

            //if credentials are correct, return user obj
            return done(null, user);

        });
    }));
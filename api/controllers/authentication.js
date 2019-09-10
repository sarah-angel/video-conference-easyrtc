var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var sendJSONresponse = function(res, status, content) {
    res.status(status);
    res.json(content);
  };

  //dbtest
  module.exports.dbtest = function(req, res){
      console.log("***dttest started");
    
      var user = new User();
      user.name = "Test Test";
      user.username = "test";
      user.setPassword("test");

      user.save(function(err){
          if(err){
              console.log("***failed to add test user to db: " + err);
          }
          console.log("***test user added to db");
      });

      User.find({}, function(err, doc){
          if(err){
              console.log("***failed to connect to dbtest");
          }
          console.log((doc))
      });
  }

//register controller
//take submitted data create new mongoose instance
//call setPassword and add salt and hash, then save instance as record in db 
//generate jwt then send in json
module.exports.register = function(req, res){
    
    var user = new User();
     user.name = req.body.name;
     user.username = req.body.username;
     user.department = req.body.department;
     user.position = req.body.position;
     user.email = req.body.position;
     user.setPassword(req.body.password);
    
     user.save(function(err){
        if(err){
            console.log("****error saving to db");
        } 
        var token;
        
         token = user.generateJwt();

         res.status(200);
         res.json({
             "token": token
         });
     });
};


module.exports.login = function(req, res){
    // const { body: { user } } = req;
    // if(!user.username) {
    //     return res.status(422).json({
    //       errors: {
    //         username: 'is required',
    //       },
    //     });
    //   }
    passport.authenticate('local', function(err, passportUser, info){
        //var token;

        if(err){
            res.status(404).json(err);
            return;
        }

        //if user is found
        if(passportUser){            
            // token = passportUser.generateJwt();
            // res.status(200);
            // res.json({
            //     "token": token
            // });

            const user = passportUser;
            user.token = passportUser.generateJwt();

            return res.json({ user: user.toAuthJSON()});

            
        }else {
            //if user not found
            console.log("user not found");
            res.status(401).json(info);
        }
    })(req, res);
};

//gets jwt token from browser and send logged in user info
//maps current user to easyrtcid
module.exports.currentUser = function(req, res){
    //if no user id exists in the jwt return a 401
    if(!req.payload._id){
        res.status(401).json({
            "message": "UnauthorizedError: private profile"
        });
    }else {
        //
    }
};
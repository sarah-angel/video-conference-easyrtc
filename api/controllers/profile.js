//only allow user to be able to view their own profiles
//get user ID from jwt and use it in a mongoose query

var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports.profileRead = function(req, res){
    //if no user id exists in the jwt return a 401
    if(!req.payload._id){
        res.status(401).json({
            "message": "UnauthorizedError: private profile"
        });
    }else {
        User
            .findById(req.payload._id)
            .exec(function(err, user){
                res.status(200).json(user);
            });
        console.log("**profile find user from db: " + req.payload._id);
    }
};
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports.listAllUsers = function(req, res){


    console.log("***fetching list of all users");
    console.log("***dept post: " + req.body.department);

    User.find({department: req.body.department },
        { position: 1, name: 1}, 
        function(err, result){
        if(err){
            console.log("***failed to fetch list of users: " + err);
        }
        res.status(200).json(result);
        console.log(result);
    })
}

module.exports.listDept = function(req, res){
    console.log("***fetching list of dept");

    User.distinct("department", function(err, result){
        if(err){
            console.log("***failed to fetch departments: " + err);
        }
        res.status(200).json(result);
        console.log(result);
    })
}
const fs = require("fs");
var jwt = require('express-jwt');

var user = {
    easyId: null,
    _id: null,
    name: null,
    position: null
};

module.exports.mapIds = function(req){
        //if no user id exists in the jwt return a 401
    if(!req.payload._id){
        console.log("Unauthorized Error")
    }else {
        user._id = req.payload._id;
        user.name = req.payload.name;
        user.position = req.payload.position;
    }
    
    
    if (!user.easyId){
        //add error handler
        return
    }else{
        console.log(process.cwd());

    fs.readFile(__dirname + "/../models/idMap.json", "utf8", function(err, json){
        if(err){
            console.log(err);
        }
        var arr = JSON.parse(json);
        arr.push(user);
        
        let data = JSON.stringify(arr, null, 2);
        fs.writeFile(__dirname + "/../models/idMap.json", data, (err)=>{
            if(err) throw err;
            console.log("user added to file");
        });
    });
    }
}

module.exports.setEasyrtcId = function (easyId){
    if(easyId){
        user.easyId = easyId;
    }
}

//given a userId return related easyrtcid from idMap.json
module.exports.getEasyIdFromUserId = function(){

}

//given easyrtcid return the related user's details
module.exports.getUserFromEasyId = function(req, res){
    console.log(req.body.easyrtcid);
}
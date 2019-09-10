var easyrtc = require('easyrtc');


module.exports.createRoom = function(req, res){
    console.log("creating "+ req.body.name +" room");
    easyrtc.events.emit("roomCreate", appObj, creatorConnectionObj, req.body.name, roomOptions, function(err, roomObj){
        if(err){
            console.log(err);
        }
        else{
            console.log(roomObj);
        }
    });
}

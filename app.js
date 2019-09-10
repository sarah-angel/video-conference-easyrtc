var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var debug = require('debug')('video-app:server');
var http = require('http');
var cors = require('cors');

var socketIo = require('socket.io');
var easyrtc = require('easyrtc');

require('./api/models/db');
require('./api/config/passport');
var auth = require('./api/controllers/authentication');
var idMap = require('./api/controllers/idMap');

var routesApi = require('./api/routes/index');
var app = express();
var username = '';

app.use(express.static(__dirname + '/demo')); 
app.use(express.static(__dirname + '/node_modules'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.get('/', function(req, res){
    res.sendFile(__dirname + '/demo/index.html');
});

//passport initialized as express middleware 
app.use(passport.initialize());
app.use('/api', routesApi);

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

var server = http.createServer(app);
//start socket.io so it attaches itself to express server
var socketServer = socketIo.listen(server, {'log level':1});

easyrtc.setOption('logLevel', 'debug');

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

//error handlers
//catch unauthorized users
app.use(function (err, req, res, next){
    if(err.name === 'UnauthorizedError'){
        res.status(401);
        res.json({"message": err.name + ": " + err.message});
    }
});

function normalizePort(val){
    var port = parseInt(val, 10);

    if(isNaN(port)){
        return val;
    }

    if(port >= 0){
        return port;
    }

    return false;
}

function onError(error){
    if(error.syscall !== 'listen'){
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port

        switch(error.code){
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
}


function onListening() {
    console.log("listening on port");
    var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
  }

// Overriding the default easyrtcAuth listener, only so we can directly access its callback
easyrtc.events.on("easyrtcAuth", function(socket, easyrtcid, msg, socketCallback, callback) {
    easyrtc.events.defaultListeners.easyrtcAuth(socket, easyrtcid, msg, socketCallback, function(err, connectionObj){
        if (err || !msg.msgData || !msg.msgData.credential || !connectionObj) {
            callback(err, connectionObj);
            return;
        }

        connectionObj.setField("credential", msg.msgData.credential, {"isShared":false});

        console.log("["+easyrtcid+"] Credential saved!", connectionObj.getFieldValueSync("credential"));

        callback(err, connectionObj);
    });
});


// To test, lets print the credential to the console for every room join!
easyrtc.events.on("roomJoin", function(connectionObj, roomName, roomParameter, callback) {
    console.log("["+connectionObj.getEasyrtcid()+"] Credential retrieved!", connectionObj.getFieldValueSync("credential"));
    console.log("******easyrtcid: "+connectionObj.getEasyrtcid()+",username: "+username+", roomName: "+roomName);
    
    //idMap.setEasyrtcId(connectionObj.getEasyrtcid());
    easyrtc.events.defaultListeners.roomJoin(connectionObj, roomName, roomParameter, callback);
});

easyrtc.events.on("disconnect", function(connectionObj, next){
    console.log("*******disconnected");
    easyrtc.events.defaultListeners.disconnect(connectionObj, next);
});

// Start EasyRTC server
var rtc = easyrtc.listen(app, socketServer, null, function(err, rtcRef) {
    console.log("Initiated");

    rtcRef.events.on("roomCreate", function(appObj, creatorConnectionObj, roomName, roomOptions, callback) {
        console.log("roomCreate fired! Trying to create: " + roomName);

        appObj.events.defaultListeners.roomCreate(appObj, creatorConnectionObj, roomName, roomOptions, callback);
    });
});


  module.exports = app;
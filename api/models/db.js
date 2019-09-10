
var mongoose = require('mongoose');
var gracefulShutdown;

const dbURI = "mongodb+srv://user1:user1pwd@cluster0-wi3ox.mongodb.net/test?retryWrites=true&w=majority";

mongoose.connect(dbURI, {useNewUrlParser: true});

mongoose.connection.on('connected', function(){
    console.log('Mongoose connected to ' + dbURI);
});

mongoose.connection.on('error', function(err){
    console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function(){
    console.log('Mongoose disconnected');
});


gracefulShutdown = function(msg, callback){
    mongoose.connection.close(function(){
        console.log('Mongoose disconnected through ' + msg);
        callback();
    });
};

//for app termination
process.on('SIGINT', function(){
    gracefulShutdown('app termination', function(){
        process.exit(0);
    });
});

require('./users');
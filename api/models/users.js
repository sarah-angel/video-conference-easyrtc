var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false
    },
    hash: String,
    salt: String
}, {collection: 'users'});

//salt is a unique string of char for each user
//hash created by combining given pwd and salt then applying one way encryption
//randomBytes sets salt, pdkd sets the hash
userSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

//checking the pwd; encrypt salt and hash and see if output matches stored hash
userSchema.methods.validPassword = function(password){
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
};

//generate json web token
//sign creates jwt by passing data to be included in token.
userSchema.methods.generateJwt = function(){
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        _id: this._id,
        username: this.username,
        name: this.name,
        position: this.position,
        exp: parseInt(expiry.getTime() / 1000),
    }, "MY_SECRET");
};

userSchema.methods.toAuthJSON = function(){
    return {
        _id: this._id,
        username: this.username,
        name: this.name,
        position: this.position,
        token: this.generateJwt()
    };
}
mongoose.model('User', userSchema, "users");
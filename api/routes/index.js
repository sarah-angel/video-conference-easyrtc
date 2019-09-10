//only authenticated users can acces routes
//ensure jwt sent is genuine
//payload property to create on req obj that will hold the jwt
var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');

const getTokenFromHeaders = (req) =>{
    //console.log(req);
    const { headers: { Authorization }} = req;

    if(Authorization && Authorization.split(' ')[0] === "Token"){
        return Authorization.split(' ')[1];
    }
    return null;
};

// var auth = jwt({
//     secret: "MY_SECRET", 
//     userProperty: 'payload',
//     getToken: getTokenFromHeaders //added
// });

const auth = {
    required: jwt({
        secret: 'MY_SECRET',
        userProperty: 'payload',
        //getToken: getTokenFromHeaders
    }),
    optional: jwt({
        secret: 'MY_SECRET',
        userProperty: 'payload',
        getToken: getTokenFromHeaders,
        credentialsRequired: false
    })
};

var ctrlProfile = require('../controllers/profile');
var ctrlAuth = require('../controllers/authentication');
var ctrlListUsers = require('../controllers/listUsers');
var ctrlEmail = require('../controllers/email')
var ctrlIdMap = require('../controllers/idMap');
var ctrlConference = require('../controllers/conference');

//route test
router.get('/test', function(req, res, next){
    //res.render('../../demo/index.html');
    res.send("test list users");
    res.end();
});

router.post('/createRoom', ctrlConference.createRoom);
router.post('/mapToUserId', auth.required, ctrlIdMap.getUserFromEasyId);
router.post('/currentUser', auth.required, ctrlIdMap.mapIds);
router.post('/sendInvite', ctrlEmail.sendInvite);
router.get('/depts', ctrlListUsers.listDept);
router.post('/listUsers', ctrlListUsers.listAllUsers);
router.post('/testdb', ctrlAuth.dbtest);
router.get('/profile', auth.required, ctrlProfile.profileRead);
router.post('/login', auth.optional, ctrlAuth.login);
router.post('/register', ctrlAuth.register);



module.exports = router;
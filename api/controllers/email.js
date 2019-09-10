var mailer = require('nodemailer');


module.exports.sendInvite = function(req, res){
    console.log(req.body);
    var senderPosition = req.body.senderPosition;
    var senderName = req.body.senderName;
    var confName = req.body.confName;
    var date = req.body.date;
    var time = req.body.time;
    var description = req.body.description;
    var link = req.body.link;

    var auth = {
        type: 'OAUTH2',
        user: 'sarangel333@gmail.com',
        clientId: '78839088079-gduh77hj38fqlt4ch3fhgca71g0msuuk.apps.googleusercontent.com',
        clientSecret: 'Z2-NBTvs-w5zsrYtYdNlSEsW',
        refreshToken: '1/zAykNYSlcbcnNr6usdWbIN-gU5shFpMEJSabWN4hXSc'
    };
    

    let mailOptions = {
        from: 'sarangel333@gmail.com',
        to: req.body.to,
        subject: req.body.subject,
        //text: 'body text',//req.body.text,
        html: `<p>Dear User, </p>
                <p>`+req.body.senderPosition+`, `+req.body.senderName+`, is inviting you to a scheduled Video Conference meeting.</p>
                <p>Topic: `+ req.body.confName + `</p>
                <p>Date/Time: `+ req.body.date + ` ` + req.body.time + `
                <p>` + req.body.description + `</p>
                <p>Please join the conference using the link below.</p>
                <p>` + req.body.link + `</p>`
    };
    
    let transporter = mailer.createTransport({
        service: 'gmail',
        auth: auth
    });

    transporter.sendMail(mailOptions, (err, info) => {
        if(err){
            return console.log(err);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    });

}


// module.exports.sendInvite = function(req, res){
//     var transporter = mailer.createTransport({
//         service: 'gmail',
//         auth: {
//             user: 'sarangel333@gmail.com',
//             pass: 'spongebob1999'
//         }
//     });

//     var mailOptions = {
//         from: 'Admin',
//         to: 'sarangel333@gmail.com',
//         subject: "subject",
//         text: "text",
//         html: "<p>html para</p>"
//     };

//     transporter.sendMail(mailOptions, function(err, info){
//         if(err){
//             console.log(err);
//         }else{
//             console.log("Email sent: " + info.response);
//         }
//     });
// }
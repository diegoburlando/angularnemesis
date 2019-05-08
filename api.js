const express = require('express');
const router = express.Router();
const redis = require('redis');
const session = require('express-session');
const redisStore = require('connect-redis')(session);
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const formidable = require('formidable');
const { exec } = require('child_process');
const fftwrapper = require('./fft/ffthelper');
const path = require('path');
const fs = require('fs');
const mongoClient = require('mongodb');
//const mongoconnection = "mongodb://admin:nemesis@ec2-18-223-235-76.us-east-2.compute.amazonaws.com:27017/?serverSelectionTimeoutMS=5000&connectTimeoutMS=10000&authSource=admin&authMechanism=SCRAM-SHA-256";
const mongoconnection = "mongodb://admin:nemesis@localhost:27017/?serverSelectionTimeoutMS=5000&connectTimeoutMS=10000&authSource=admin&authMechanism=SCRAM-SHA-256";
const register = require('./register');
const login = require('./login');
const checkusernameemail = require('./checkusernameemail');
const loginwithtoken = require('./loginwithtoken');
const request = require("request");
const nodemailer = require("nodemailer");
const verifyuser = require('./verifyuser');

const allowCrossDomain =  (req, res, next) => {// In order to test in dev mode uncomment one of the 2 following lines and the subsequent to set it
  //let allowedOrigins = ['http://localhost:4200']; // Angular
  //let allowedOrigins = ['http://localhost:3000']; // React
  let allowedOrigins = ['https://diegoburlando.github.io'];
  res.header('Access-Control-Allow-Origin', allowedOrigins);
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, csrf-token, Custom-Auth-Step1, Custom-Auth-Step2, Custom-Auth-Step3, Custom-Auth-Step4');
  if ('OPTIONS' == req.method) {res.sendStatus(200); }
  else { next(); }
};

const redisClientSetup = () => {
  const redisClientforSessions = redis.createClient({host : '127.0.0.1', port : 6379});
  redisClientforSessions.auth('YDDE/R8nbUmBUZ/3AI5sxyChaoqB0CHsrridUbrr+V4K3a/2Gylc/jqk2hjeOYoa8PGtTy5TDkMI4GDB',(err,reply) => { console.log(err); console.log(reply);});
  redisClientforSessions.on('ready',() =>{ console.log("Redis is ready"); });
  redisClientforSessions.on('error',() => { console.log("Error in Redis"); });
  return redisClientforSessions;
};

const sessionSetup = session({
  secret: 'gvqZnurvxrSs6sN',
  store: new redisStore({client: redisClientSetup()}),
  saveUninitialized: true,
  resave: true,
  cookie: { secure: false, maxAge: 3600 * 1000 }
});


router.use(allowCrossDomain);
router.use(sessionSetup);
router.use(cookieParser());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use((req, res, next) => { res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private'); next(); });


router.get('/', function (req, res) {
  const apiInfo = `
  <div>
      <h2>This is the help page for Algorithmnemesis.cloud APIs</h2>
      <p>The following routes are implemented:</p>
      <ul>
          <li>/postaudio</li>
          <li>/fetchjournal</li>
          <li> /login</li>
          <li>/register</li>
          <li>/createnewjournalentry</li>
          <li> /authtoken</li>
          <li>/checkusernameemail</li>
          <li>/loginwithtoken</li>
          <li> /contactus</li>
          <li>/verifyuser</li>
      </ul>
  </div>`
  res.send(apiInfo); 
})

router.post('/postaudio', (req, res) => {
    
  let fileNameRecorded = "";
    new formidable.IncomingForm().parse(req)
      .on('fileBegin', (name, file) => {fileNameRecorded = name; file.name = name + '.flac'; file.path = __dirname + '/uploads/' + file.name; })
      .on('file',  (name, file) => {              
          const convertCommand = exec('sh ' + __dirname + '/convert.sh ' + fileNameRecorded  );        
          convertCommand.stdout.on('data',  (data) => { console.log(data); });    
          convertCommand.stderr.on('data', (data) => {});        
          convertCommand.on('close', (code) => {            
              let wavPath = path.resolve(__dirname, 'uploads/' + fileNameRecorded + '.wav');          
              console.log("Starting conversion...")
              let btc = fs.readFileSync(wavPath);           
              let rawAudio = new Int16Array(btc.buffer, 44, Math.floor((btc.buffer.byteLength / 2 ) - 22));
              console.log('Ending conversion...');                              
              //fs.writeFile( path.resolve(__dirname, 'uploads/raw.raw'), btc.slice(44,btc.buffer.byteLength), (err) => {});
              console.log(`conversion process exited with code ${code}`);
              // more compatible 
              //res.json({message: 'Data converted to 16 bits PCM', waveform: Array.prototype.slice.call(rawAudio) });
              // Less compatible with old browsers is the following ES6
              let rawAudioData = Array.from(rawAudio)
              let fftD = fftwrapper.performFft(rawAudioData);
              res.json({message: 'Data converted to 16 bits PCM', waveform: rawAudioData, fftData:fftD });         
  
          });       
  
      })    
      .on('field', (name, field) => {console.log('Field', name, field); })
      .on('aborted', () => {console.error('Request aborted by the user');})
      .on('error', (err) => {console.error('Error', err); throw err; })    
      .on('end', () => {})
  
});

router.post('/fetchjournal', (req, res) => {

  const fetchJournal = () => {
      let useremail= req.body.useremail;
      mongoClient.connect(mongoconnection,{ useNewUrlParser: true }, (err, client) => {
          if (err) return err;                                       
          const db = client.db('nemesis');
          const collection = db.collection('UserProfile');
          collection.findOne({"profile.useremail" : useremail}, (err, userprofile) => {
              if(err) return err;                
              console.log(userprofile);
              return userprofile.content.journal.entries;
            });
      }); 
  }   

  loginwithtoken(req.body.token)
  .then( async () => {         
       let journal = await fetchJournal();   
       res.json(journal);  
  })
  .catch((err) => {
      res.json(err);
  })

});

router.post('/createnewjournalentry', (req, res) => {

  const createNewJournalEntry = () => {        
      let params = {    
          useremail: req.body.useremail,
          entrycontent:req.body.entrycontent,
          entrytitle :req.body.entrytitle,
          entrydate: req.body.entrydate            
      };

      mongoClient.connect(mongoconnection,{ useNewUrlParser: true }, (err, client) => {
          if (err) res.json(err);                                       
          const db = client.db('nemesis');
          const collection = db.collection('UserProfile');
          collection.updateOne({"profile.useremail" : params.useremail}, { 
              "$push": { "content.journal.entries": {"entryText":params.entrycontent,"entryDate":params.entrydate, "entryTitle":params.entrytitle} }                
           }, (err, result) => {
              if(err) res.json(err);                
              console.log(result);
              res.json({success:true});
            });
      });
  }

  loginwithtoken(req.body.token)
  .then(async () => {
      await createNewJournalEntry();
  })
  .catch((err) => {
      res.send(err);
  })

});

router.post('/register',  (req, res) => { 
  let body = req.body;
  let username = body.username;
  let userfirstname = body.userfirstname;
  let userlastname = body.userlastname;
  let useremail = body.useremail;
  let userpassword = body.userpassword; 
  let useraddress1 = body.useraddress1;
  let useraddress2 = body.useraddress2;
  let usercity = body.usercity;
  let userpostalcode = body.userpostalcode;
  let usercountry = body.usercountry;
  let recaptcha = body.recaptcha;
  let clientIp =  req.connection.remoteAddress;
  
  register(username, userfirstname, userlastname, useremail, userpassword, useraddress1, useraddress2,
  usercity, userpostalcode, usercountry, recaptcha, clientIp)
      .then(
      (data) => {                       
          res.send(data);            
      })
      .catch((error) => {res.send(error)});
});

router.post('/login', (req,res) => { 
   
  req.session.pippo="pippo";   
  let body = req.body;
  let usernameemail = body.usernameemail;
  let userpassword = body.userpassword;
  login(usernameemail, userpassword,req)
  .then((data)=> { 
      req.session.authToken = data.token;       
      res.send(data);
  })
  .catch((err) => {
      res.send(err);
  })
});

router.get('/authtoken',(req,res) => {
  console.log(req.session.authToken);
  res.json(req.session.authToken);

});

router.post('/checkusernameemail', (req,res) => {
  let body = req.body;
  let usernameemail = body.usernameemail;
  checkusernameemail(usernameemail)
  .then((data => {        
      res.send(data)
  }))
  .catch((err) => {
      res.send(err);
  })
});

router.post('/loginwithtoken', (req,res) => {
  let body = req.body;
  let token = body.token;

  loginwithtoken(token)
  .then((data)=> {      
      res.send(data);
  })
  .catch((err) => {
      res.send(err);
  })
});

router.post('/contactus', (req,res) => {
 
  let captcha = req.body.captcha;
  let clientIp = req.ip;
  let email = req.body.email;
  let customerName= req.body.customerName;
  let message = req.body.message;
      
      request.post({url:"https://www.google.com/recaptcha/api/siteverify", form: {secret:"6LfdDkYUAAAAAK5aGW-BEzk6Q9e1PgxtaTmPNRnS", response :captcha, remoteip:clientIp}}, (err,httpResponse,body) => {
          if(err){}
          let success = (JSON.parse(body)).success;		
          if(success){
              let transporter = nodemailer.createTransport({
                  host: "smtp.gmail.com",
                  port: 587,
                  secure: false,
                  auth: {user: "diegoaldoburlando62@gmail.com", pass: "xthyfukezwdxywee"}
              });  
              let mailOptions = {
                  from: "diegoaldoburlando62@gmail.com",
                  to: email,
                  bcc:["diegoaldoburlando62@gmail.com","maria.bu62442@gmail.com"],
                  subject: `Hello ${customerName}, Thanks for contacting us!`,
                  text: "",	
                  html: `<!DOCTYPE html>
                  <html lang="en" xmlns="http://www.w3.org/1999/xhtml">
                  <head>
                      <meta charset="utf-8" />
                      <title></title>
                      <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
                      <style>
                          .email-text {
                              font-size: 15px;
                              font-family: 'Open Sans', sans-serif;
                              color: rgb(4,13,32);
                          }
                          .div-hr {
                              height: 3px;
                              background: linear-gradient(to right, rgba(4,13,32,1), rgba(4,13,32,0));
                              width: 30%;
                          }
                          .logo {
                              background-color: rgb(4,13,32);
                              border-radius: 50%;						
                          }
                      </style>
                  </head>
                  <body style="font-family: 'Open Sans', sans-serif;">
                      <pre class="email-text"><b>Dear ${customerName},</b><br /><br />We have received your request quoted as follows:</pre>
                      <div class="div-hr"></div>
                      <p class="email-text"><i>${message}</i></p>
                      <div class="div-hr"></div>
                      <pre class="email-text">Thanks for your inquiry. we will respond within one working day using your provided email <i>${email}</i>.<br /><br />Kindest regards,<br />The team at DM88 Ltd.</pre>
                      <img class="logo" width=150 src="https://algorithmnemesis.cloud/static/media/nav-windRose.d471dbde.png" />    
                  </body>
                  </html>`
              };
              transporter.sendMail(mailOptions, (error, info) => {
                  if (error) {
                      res.json({ message: error });                     
                      return;
                  }
                  res.json({message: `Message sent at ${email} with the following id: ${info.messageId}`,success:success,clientIp:clientIp});                  
              });
              return;		
          }
          res.json({message: "failure",success:success });       
        
      });

});

router.get('/verifyuser', (req,res) => {
  
  let userid = req.query.userid;    
  verifyuser(userid)
  .then(() => {
          res.json({verified:true});
      })
  .catch(() => {
          res.json({verified:false});
      })
});

router.post('/postsc',(req,res) => {
  req.session.shoppingCart = req.body.shoppingCart;    
  res.json({ state:"Session Acquired" });
});

router.get('/getsc',(req,res) => {
  if(req.session.shoppingCart) res.json(req.session.shoppingCart);
  else res.json({session:false});

});

router.get('/about', function (req, res) {
  res.send('Written by Diego and MAria Burlando 2019')
});

router.post('/visits', (req,res, next) => {   

    request({
        url: `https://ipinfo.io/${req.body.visitorIp}?token=79cd96740a1e54`,
        headers: {
          'Accept': 'application/json'
        }
    }, (err,httpResponse,visitordata) => {
        if (err) res.json(err);
    
        mongoClient.connect(mongoconnection,{ useNewUrlParser: true }, (err, client) => {
            if (err) res.json(err);                                       
            const db = client.db('nemesis');
            const collection = db.collection('Visits');
            collection.findOneAndUpdate({"idVisitors" : "nemesis"},
            { 
                "$push": { "visitors": {"visitDate":req.body.visitDate,"visitorData": JSON.parse(visitordata)} }                
            }, 
            { returnOriginal:false },
            (err, visitsDoc) => {
                if(err) res.json(err);               
                res.json(visitsDoc.value.visitors.length);
            });
        });        
    });
});

router.get('/bachflowers', (req,res,next) => {

    mongoClient.connect(mongoconnection,{ useNewUrlParser: true }, (err, client) => {
        if (err) res.json(err);                                       
        const db = client.db('nemesis');
        const collection = db.collection('BachFlowers');
        collection.find({}).toArray((err, flowers) => {
            if(err) res.json(err);               
            res.json(flowers);
        });
    });        

})

module.exports = router
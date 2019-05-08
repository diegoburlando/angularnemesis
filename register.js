const  sqlite3 = require('sqlite3');
const bcrypt = require('bcrypt');
const randomstring = require('randomstring');
const request = require('request');
const emailUser = require('./emailuser');
const saltRounds = 12;

const mongoClient = require('mongodb');
//const mongoconnection = "mongodb://admin:nemesis@ec2-18-223-235-76.us-east-2.compute.amazonaws.com:27017/?serverSelectionTimeoutMS=5000&connectTimeoutMS=10000&authSource=admin&authMechanism=SCRAM-SHA-256";
const mongoconnection = "mongodb://admin:nemesis@localhost:27017/?serverSelectionTimeoutMS=5000&connectTimeoutMS=10000&authSource=admin&authMechanism=SCRAM-SHA-256";


var register =  function(username, userfirstname, userlastname, useremail,
userpassword, useraddress1, useraddress2, usercity,
userpostalcode, usercountry, recaptcha, clientIp) {
    
    return new Promise( (resolve, reject) => {

    request.post({
        url:"https://www.google.com/recaptcha/api/siteverify",
		form: {
            secret:"6LfdDkYUAAAAAK5aGW-BEzk6Q9e1PgxtaTmPNRnS",
			response :recaptcha,
            remoteip:clientIp
        }}, (err,httpResponse,body) => { 

            if(err)  return reject({success:false, message:'Could not register user'}); 
            let success = (JSON.parse(body)).success; 
            if (!success) return reject({success:false, message:'Could not register user'});
            var db = new sqlite3.Database(__dirname + '/../sql/marydb.db');

            db.serialize(() => {
                db.get(`SELECT * FROM users WHERE userEmail = '${useremail}' OR userName = '${username}'`,  (err, res) => {
                    if (err) {
                        db.close((err) => {if (err) return console.error(err.message); console.log('Close the database connection.', db);});
                        return reject({success:false, message:err.message});
                    }
                    if(res){
                        db.close((err) => {if (err) return console.error(err.message); console.log('Close the database connection.', db);});
                        return reject({success:false, message:'User already exists'});
                    }
                    bcrypt.genSalt(saltRounds, (err, salt) => {
                        let asyncSalt = salt;                 
                        bcrypt.hash(userpassword, salt)                
                        .then((hash) => {    
                            db.run(`INSERT INTO users (userName, userFirstName, userLastName, userEmail, userPassword, userPasswordSalt,
                            userAddress1, userAddress2, userCity, userPostalCode, userCountry, userIsVerified, userIsAdmin)
                            VALUES ('${username}','${userfirstname}', '${userlastname}', '${useremail}','${hash}', '${asyncSalt}', '${useraddress1}',
                            '${useraddress2}', '${usercity}', '${userpostalcode}', '${usercountry}', '0', 'false')`, (err) => {                    
                                if (err) {
                                    db.close((err) => {if (err) return console.error(err.message); console.log('Close the database connection.', db);});
                                    return reject({success:false, message:'Could not register user0', err: err});
                                }
                                let secretJwt = randomstring.generate(12);
                                db.run(`INSERT INTO jwtsecrets (userId, jwtsecret)
                                VALUES ((SELECT userId FROM users WHERE userName = '${username}'), '${secretJwt}')`, (err) => {
                                    if(err) {
                                        db.close((err) => {if (err) return console.error(err.message); console.log('Close the database connection.', db);});
                                        return reject({success:false, message:'Could not register user1'});
                                    }
                                    db.get(`SELECT userId FROM users WHERE userName = '${username}'`, async (err,res) => {
                                        if(err) {
                                            db.close((err) => {if (err) return console.error(err.message); console.log('Close the database connection.', db);});
                                            return reject({success:false, message:'Could not register user2'});     
                                        }  
                                        if(!res){
                                            db.close((err) => {if (err) return console.error(err.message); console.log('Close the database connection.', db);});
                                            return reject({success:false, message:'Could not register user3'});
                                        }
                                        let useridtosend = res.userId;
                                        emailUser(useremail, useridtosend);   
                                        db.close((err) => { if (err) return console.error(err.message); console.log('Close the database connection.', db);});

                                             let Payload = {                                   
                                                userid: useridtosend,
                                                profile: {
                                                    username: username, 
                                                    userfirstname: userfirstname, 
                                                    userlastname: userlastname, 
                                                    useremail: useremail,                                                     
                                                    useraddress1: useraddress1 === "" ? "NOT_SUPPLIED" : useraddress1, 
                                                    useraddress2: useraddress2 === "" ? "NOT_SUPPLIED" : useraddress2, 
                                                    usercity: usercity === "" ? "NOT_SUPPLIED" : usercity,
                                                    userpostalcode: userpostalcode === "" ? "NOT_SUPPLIED" : userpostalcode, 
                                                    usercountry: usercountry === "" ? "NOT_SUPPLIED" : usercountry
                                                },
                                                content:{journal:{entries:[]}}
                                              }

                                            mongoClient.connect(mongoconnection,{ useNewUrlParser: true }, (err, client) => {
                                                if (err) return reject({success:false, message:'Could not create journal profile'});                                       
                                                const db = client.db('nemesis');
                                                const collection = db.collection('UserProfile');
                                                collection.insertOne(Payload, (err, result) => {
                                                    if(err) return reject({success:false, message:'Could not create journal profile',error:err});                                                   
                                                    console.log("Inserted 1 document into the collection");
                                                    return resolve({success:true, message:'User created and email sent',result:result});;
                                                  });
                                            });                                      
                                                                               
                                    });
                                }); 
                            }); 
                        });
                    });
                });
            });
        });
    });
};

module.exports = register;
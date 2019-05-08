const  sqlite3 = require('sqlite3');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


var login = function(usernameemail, userpassword) {
    var db = new sqlite3.Database(__dirname + '/../sql/marydb.db');
    return new Promise((resolve,reject)=> {
        db.serialize(() => {
            db.get(`SELECT * FROM users WHERE userName = '${usernameemail}' OR userEmail = '${usernameemail}'`,  (err, user) => {
                if (err) {
                    db.close((err) => {if (err) return console.error(err.message); console.log('Close the database connection.', db);});
                    return reject({success:false, message:err.message});
                }
                if(!user){
                    db.close((err) => {if (err) return console.error(err.message); console.log('Close the database connection.', db);});
                    return reject({success:false, message:'User does not exist'});
                }
                if(!user.userIsVerified) {
                    db.close((err) => {if (err) return console.error(err.message); console.log('Close the database connection.', db);});
                    return reject({success:false, message:'User not verified'});
                }
                let salt = user.userPasswordSalt;
                let hash = bcrypt.hashSync(userpassword, salt); 
                if (hash === user.userPassword) {
                    db.get(`SELECT jwtsecret FROM jwtsecrets WHERE userId = '${user.userId}'`, (err,jwtres) => {                        
                        if (err) { 
                            db.close((err) => {if (err) return console.error(err.message); console.log('Close the database connection.', db);});
                            return reject({success:false, message:err.message});
                        }   
                        if(!jwtres){
                            db.close((err) => {if (err) return console.error(err.message); console.log('Close the database connection.', db);});
                            return reject({success:false, message:'User does not exist'});
                        }
                        let claim = {firstName: user.userFirstName, lastName: user.userLastName, email:user.userEmail, isAdmin: user.userIsAdmin};
                        let token = jwt.sign(claim, jwtres.jwtsecret, { expiresIn: "2 days" });                       
                        
                        db.close((err) => {if (err) return console.error(err.message); console.log('Close the database connection.', db);});       
                        return resolve({success:true, message:'User logged in', token: token, claim: claim})
                    })
                }
                else {
                    db.close((err) => {if (err) return console.error(err.message); console.log('Close the database connection.', db);});
                    return reject({success:false, message:'Invalid credentials'});
                }     
            });
        });

        
    });
};

module.exports = login;
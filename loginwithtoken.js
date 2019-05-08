const  sqlite3 = require('sqlite3');
const jwt = require('jsonwebtoken');


var loginwithtoken = function(token) {

    var db = new sqlite3.Database(__dirname + '/../sql/marydb.db');

    return new Promise((resolve,reject)=> {

        let claim = jwt.decode(token);
        if (claim === null) {           
            return reject({success:false});
        }



        db.serialize(() => {
            db.get(`SELECT jwtsecret FROM jwtsecrets WHERE userId = (SELECT userId FROM users WHERE userEmail = '${claim.email}')`,  (err, res) => {
                if (err) {
                    db.close((err) => {if (err) return console.error(err.message); console.log('Close the database connection.', db);});
                    return reject({success:false, message:err.message});
                }
              
                jwt.verify(token, res.jwtsecret, (err,decoded) => {
                    if (err) {
                        db.close((err) => {if (err) return console.error(err.message); console.log('Close the database connection.', db);});
                        return reject({success:false, message:err.message});
                    }
                    db.close((err) => {if (err) return console.error(err.message); console.log('Close the database connection.', db);});
                    return resolve({success:true, claim: claim, message: 'User logged with token'});
                })

        });
        
    })
})}

module.exports = loginwithtoken;
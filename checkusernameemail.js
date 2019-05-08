const  sqlite3 = require('sqlite3');

var checkusernameemail = function(usernameemail) {

    return new Promise((resolve,reject)=> {  
        var db = new sqlite3.Database(__dirname + '/../sql/marydb.db');
        db.serialize(() => {
            db.get(`SELECT * FROM users WHERE userName = '${usernameemail}' OR userEmail = '${usernameemail}'`, (err,user) => {
                if (err) {
                    db.close((err) => {if (err) return console.error(err.message); console.log('Close the database connection.', db);});
                    return reject({success:false, message:err.message});
                }
                if(!user){
                    db.close((err) => {if (err) return console.error(err.message); console.log('Close the database connection.', db);});
                    return reject({userExists:false});
                }
                db.close((err) => {if (err) return console.error(err.message); console.log('Close the database connection.', db);});
                return resolve({userExists:true});
            });
        });        
    });
};

module.exports = checkusernameemail;
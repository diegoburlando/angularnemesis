const  sqlite3 = require('sqlite3');

var verifyuser = function(userid) {
    return new Promise((resolve,reject)=> { 
        var db = new sqlite3.Database(__dirname + '/../sql/marydb.db'); 
        db.serialize(() => {
            db.run(`UPDATE users SET userIsVerified = '1' WHERE userId = '${userid}'`, function(err)  {
                                           
                if (err) {
                    db.close((err) => {if (err) return console.error(err.message); console.log('Close the database connection.', db);});
                    return reject({success:false, message:err.message});
                }
                db.close((err) => {if (err) return console.error(err.message); console.log('Close the database connection.', db);});
                if(this.changes === 1) return resolve({success:true});
                return reject({success:false, message:err.message});

            });
        });
    });      
};

module.exports = verifyuser;
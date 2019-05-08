const  sqlite3 = require('sqlite3');

var verifyuser = function(userid) {
    return new Promise((resolve,reject)=> { 
        var db = new sqlite3.Database(__dirname + '/../sql/marydb.db'); 
        db.serialize(() => {
            db.run(`UPDATE users SET userIsVerified = '1' WHERE userId = '${userid}'`, function(errUpdate)  {
                                           
                if (errUpdate) {
                    db.close((errClose) => {
                        if (errClose) {
                            console.error(errClose.message); 
                            return;
                        }
                    });
                    return reject({success:false, message:errUpdate.message});
                }
                db.close((errClose1) => {
                    if (errClose1) {
                        console.error(errClose1.message); 
                        return;
                    }
                });
                if(this.changes === 1) return resolve({success:true});
                return reject({success:false, message:errClose1.message});

            });
        });
    });      
};

module.exports = verifyuser;
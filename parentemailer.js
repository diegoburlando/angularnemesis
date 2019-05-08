



const { fork } = require('child_process');
const child = fork('childmailer.js');

child.on("exit",() => { console.log("child terminated"); });

child.on('close',  (code) => {
  console.log('Child process is exiting with exit code: '+code);
});


child.on("message",(data)=> { console.log(data.body);  })


child.send({emailTo:"diegoburlando@outlook.com"});




console.log("hello my friends");
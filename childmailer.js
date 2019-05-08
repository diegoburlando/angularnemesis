const nodemailer = require("nodemailer");
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {user: "diegoaldoburlando62@gmail.com", pass: "xthyfukezwdxywee"}
    });  


process.on("message",(message)=>{

    let response ={};
    
    let mailOptions = {
        from: "diegoaldoburlando62@gmail.com",
        to: message.emailTo,       
        bcc:["diegoaldoburlando62@gmail.com"],				
        subject: `Request of information`,
        text: "Attempt",	
        //html: `<p>HELLO</p>`,
        //attachments: [{path: './photo1.jpg'},{path: 'photo2.jpg'}]
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            response.body = JSON.stringify({ message: error });	
            process.send(response);
            return;       
        }			
        response.body =JSON.stringify(info);
        process.send(response);
        return;
    });

})
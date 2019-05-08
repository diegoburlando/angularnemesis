var express  require('express')
const app = express()
const server = require('http').Server(app)



app.get('/',   (req, res) => { res.send("Hello Everybody")});

const listener = server.listen(process.env.PORT || 8000, () => {
    
    
    
    console.log(`Application worker ${process.pid} started... on port ${listener.address().port} `);
    
    
    
    
})

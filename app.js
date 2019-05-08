const express = require('express');
const app = express();
const server = require('http').Server(app);
const apiverbs = require('./api');

app.use(express.static('react'));
app.use('/api', apiverbs);
app.get('/',   (req, res) => { res.sendFile(path.join(__dirname , 'react', 'index.html'));});

const listener = server.listen(process.env.PORT || 8000, () => {
    console.log(`Application worker ${process.pid} started... on port ${listener.address().port} `);
});



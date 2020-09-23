const express = require('express');

const server = express();

server.get('/', (req, res) => {
    res.send('Hello World!')
});

server.listen(3333, () => {
    console.log('Server is up and Running ...');
});
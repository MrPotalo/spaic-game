const path = require('path');
const express = require('express');
const _ = require('lodash');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 8080;
const codes = ["POTO", "HODO", "HODY", "BRSL", "NIPL", "TATO", "TRDR", "LOLZ", "TURD", "POOP", "PODO", "HODI", "PODI", "TATR"]

app.use(express.static(path.join(__dirname, './client')));

app.get('/', (req,res,next) => {
    res.sendFile(path.join(__dirname, './client/game.html'));
});


server.listen(port);
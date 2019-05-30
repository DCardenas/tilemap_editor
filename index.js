const express = require('express');
const app = express();
const serv = require('http').Server(app);
const port = 2000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client/index.html');
});
app.use('/client', express.static(__dirname + '/client'));

serv.listen(process.env.PORT || 5000);

console.log('Server started\n');

const express = require('express')
const app = express();

console.clear();
app.listen(8081, ()=> console.log('Holandasss'));
app.use(express.static(__dirname + '/public'));
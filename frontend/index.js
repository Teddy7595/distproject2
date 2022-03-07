const express = require('express');
const path = require('path');
const app  = express();

console.clear();
app.listen(8080, ()=> console.log('Servicio de frontend activo'));



app.use(express.static(__dirname + '/public'));
app.get('/', (req, res) => res.sendFile(path.join(__dirname,'/public/login.html')) );
app.get('/register', (req, res) => res.sendFile(path.join(__dirname,'/public/register.html')) );
app.get('/grid', (req, res) => res.sendFile(path.join(__dirname,'/public/grid.html')) );
const express = require('express');
const mongo   = require('mongoose');
const env     = require('dotenv').config();
const socket  = require('ws').Server;
const app     = express();

const user = require('./controllers/user.controller');
const _srv = require('./controllers/server.controller');


//method to init the server 
const main = async () =>
{
    console.clear();
    //route array
    const _SERVER_ROUTES = 
    [   
        user,
        _srv
    ];

    const _CORS_OPTION = 
    {
        origin: ['*', 'http://localhost:8083'],
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    }

    /**
    * first instance, we create a socket service and controller
    * here, after we can handle better the socket topic, we can 
    * module them to maintain a clean architecture
    */
    const wss = new socket({
        noServer: true,
        path: '/stream'
    })

    const ws = app.listen(process.env.ENV_PORT, () => 
    {
        console.log(`Escuchando en puerto ${process.env.ENV_PORT}`);
    });
    
    wss.on('connection', async socket => 
    {
        socket.send("socket base reenviando confirmacion")
    });

    ws.on('upgrade', (request, socket, head) => 
    {
        wss.handleUpgrade(request, socket, head, socket => 
        {
            wss.emit('connection', socket, request);
        });
    });

    mongo.connect(`${process.env.MONGOURI}`,{ 
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }).then(() => console.log('Database conection stablish!'))
    .catch((e) => console.log(e));
    
    //basic configuration about what plugin are will used by the backend
    app.use(express.json({}));
    app.use(express.urlencoded({extended: true}));
    app.use('/api', _SERVER_ROUTES);

}


main();
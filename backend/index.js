const express = require('express');
const mongo   = require('mongoose');
const env     = require('dotenv').config();
const socket  = require('ws').Server;
const app     = express();

const _ssn = require('./controllers/session.controller');
const _srv = require('./controllers/server.controller');
const _tpc = require('./controllers/topic.controller');
const _pst = require('./controllers/post.controller');

const pubsub = require('./services/pubsub.service');
const PubsubService = new pubsub();


//method to init the server 
const main = async () =>
{

    console.clear();
    //route array
    const _SERVER_ROUTES = 
    [   
        _ssn,
        _srv,
        _tpc,
        _pst
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
        await PubsubService.BROKER_HANDLER(socket);
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
        useCreateIndex: true,
        autoCreate: true
    }).then(() => console.log('Database conection stablish!'))
    .catch((e) => console.log(e));

    
    
    //basic configuration about what plugin are will used by the backend
    app.use(function (req, res, next) 
    {

        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    
        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    
        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', "true");
    
        // Pass to next layer of middleware
        next();
    });
    
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use('/api', _SERVER_ROUTES);
}


main();

const { LOGINCLUSTER, TYPE_EVENTS, CACHESESSIONS } = require('../config'); 
const { rejectOpertion } = require('./misc.service');
const { WebSocket } = require('ws');
const events        = require('events');
const post          = require('./posts.service');
const topic         = require('./topics.service');

class PubsubService
{
    /** @private */
    _emitter;
    /** @private */
    _eventName;
    /** @private */
    _postService;
    /** @private */
    _topicService;
    /** 
     * @private
     * @type {import('../interfaces').socketPackage} 
     */
    _socketResponse;

    constructor()
    {
        this._emitter        = new events.EventEmitter();
        this._eventName      = ['POST', 'ONSUB', 'DESUB'];   
        this._postService    = new post();
        this._topicService   = new topic();
        this._socketResponse = { 
            '_idclient' : ' ',
            '_iduser'   : ' ',
            'message'   : ' ',
            'ok'        : false,
            'payload'   : { },
            'type'      : 0,
            'weight'    : ' '
        };

        this.WatchToSendToSubscribers();
        this.WatchOnSubscriptions();
        this.WatchDeSubscriptions();

        this.count = 0;
    }

    /**
     * Function dedicated to watch all change subscription mean while the user modify and change his fav topics
     * @private
     */
    async WatchOnSubscriptions()
    {
        //cuento me subscribo
        this._emitter.on(this._eventName[1], (event) => console.log('subscripcion;', ++this.count));
    }

    /**
     * Function dedicated to watch all desubscription generated mean while the user modify and change his fav topics
     * @private
     */
    async WatchDeSubscriptions()
    {
        //cuando me desubscribo
        this._emitter.on(this._eventName[2], (event) => console.log('desubscripcion;', ++this.count));
    }

    /**
     * Function dedicated to observe any post maded by the publisher to automatically send that post for any user conected
     * @private
     */    
    async WatchToSendToSubscribers()
    {
        this._emitter.on(this._eventName[0], (event) => console.log('publicacion;', ++this.count));
        /** necesito llamar ahora a los procedimientos de socket */
    }

    /**
     * Function to publis a new post
     * @param {{'topic':string, 'title':string, 'desc':string}} post 
     */
    async PublishANewPost(post)
    {   
        /** @type {import("../interfaces"._Response)} */
        const resp = await this._postService.createOnePost(post);
        
        if(resp.status >= 200 && resp.status <= 202)
            this._emitter.emit(this._eventName[0], resp.data[0]);

        return resp;
    }


    async OnSubscriptionHandler(idsuer, idtopic)
    {
        /** @type {import("../interfaces"._Response)} */
        const resp = await this._topicService.postOneTopicInUser(idsuer, idtopic);
        
        if(resp.status >= 200 && resp.status <= 202)
            this._emitter.emit(this._eventName[1], resp.data[0]);

        return resp;
    }

    async DeSubscriptionHandler(iduser, idtopic)
    {
        /** @type {import("../interfaces"._Response)} */
        const resp = await this._topicService.deleteTopicInUserByUserID(iduser, idtopic);
        
        if(resp.status >= 200 && resp.status <= 202)
            this._emitter.emit(this._eventName[2], resp.data[0]);
        

        return resp;
    }

    /**
     * Function to setting up a session socket with connected client 
     * If exist in the temporal http login cluster and not exist in the socket session
     * the system will find in data base all channels/topics that user have
     * and setting a new slot in the cache socket session
     * @private
     * @param {import('../interfaces').socketPackage} pckg
     * @param {WebSocket} ws 
     * @param {this} next 
     */
    async areYouConnected(pckg, ws, next = () => {return})
    {

        if(/* LOGINCLUSTER.has(pckg._iduser) && */ CACHESESSIONS.find(a => a._iduser == pckg._iduser) === undefined)
        {

            const topics = await (await this._topicService.getAllTopicByUsrID(pckg._iduser)).data[0];

            const a = {
                '_iduser'   : pckg._iduser,
                '_idclient' : '1',
               // 'socket'    : ws,
                'channels'  : topics?.topics,
                'idChannelsTable' : topics._id
            };

            CACHESESSIONS.push(a);

            pckg.ok = true;
            pckg.type    = TYPE_EVENTS.login;
            pckg.message = "All fine!";
            pckg.payload = a;
        }

        console.log('Esta o no la session:' ,CACHESESSIONS);
        ws.send(JSON.stringify(pckg));
    }

    /**
     * Function main to handle socket connection with a client
     * @param {WebSocket} ws 
     */
    async BROKER_HANDLER(ws)
    {
        /**@type {import('../interfaces').socketPackage} */
        let inPkg = {};

        ws.on('message', (event) => 
        {
            try 
            {
                
                inPkg = JSON.parse(event.toString('utf-8'));

                (inPkg.hasOwnProperty('_iduser') && inPkg.type === 1)? 
                    this.areYouConnected(inPkg, ws) : rejectOpertion('Corrupt JSON');

            } catch (error) 
            {
                this._socketResponse._iduser    = inPkg._idclient;
                this._socketResponse._idclient  = 'DENIED';
                this._socketResponse.message    = 'Corrupt package, cannot be served';
                this._socketResponse.ok         = false;
                this._socketResponse.payload    = { };
                this._socketResponse.type       = TYPE_EVENTS.error;

                ws.send(JSON.stringify(this._socketResponse));

            }
        });

        ws.on('close', (event) => { console.log(event.toString())});

        return ws;
    }
    
}


module.exports = PubsubService
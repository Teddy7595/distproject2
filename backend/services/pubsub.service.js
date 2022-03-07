
const { LOGINCLUSTER, TYPE_EVENTS, CACHESESSIONS } = require('../config'); 
const { rejectOpertion } = require('./misc.service');
const { WebSocket } = require('ws');
const events        = require('events');
const post          = require('./posts.service');
const topic         = require('./topics.service');

class PubsubService
{
    /** @private */
    clients;
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

        this.WatchToSendToSubscribers(); //broadcast each post when its created by http
        this.WatchOnSubscriptions(); //see changes in users onsubscriptios
        this.WatchDeSubscriptions(); //see changes in users desubscriptios

        
        //setInterval(() => { (CACHESESSIONS.length > 0)? this.PINGPONG() : false;}, 5000); 
        //every half seconds the server do a pingpong verification

        /** this id can be an hash number but to practically effects, just use a commom number counter */
        this.clients = 0;
    }
    
    /**
     * This function tis to mofidy the stack channels based in any change do it in the database
     * @param {any} event 
     */
    async MofidyChannelsInStack(event)
    {
        /**
        * first i need find the user in the stack sesion
        * if i find them, rewrite all the channels stackwith the new stack modified from database
        */

         await CACHESESSIONS.find( (value, index) =>
         {
             (value._iduser === event.userID)? 
                 CACHESESSIONS[index].channels = event.topics : false;
         });
    }

    /**
     * Function dedicated to watch all change subscription mean while the user modify and change his fav topics
     * @private
     */
    async WatchOnSubscriptions()
    {
        //cuento me subscribo
        this._emitter.on(this._eventName[1], async (event) => await this.MofidyChannelsInStack(event));
    }

    /**
     * Function dedicated to watch all desubscription generated mean while the user modify and change his fav topics
     * @private
     */
    async WatchDeSubscriptions()
    {
        //cuando me desubscribo
        this._emitter.on(this._eventName[2], async (event) => await this.MofidyChannelsInStack(event));
    }

    /**
     * Function dedicated to observe any post maded by the publisher to automatically send that post for any user conected
     * @private
     */    
    async WatchToSendToSubscribers()
    {
        this._emitter.on(this._eventName[0], async (event) => 
        {
            await CACHESESSIONS.forEach( async (value, index) => 
            {
                await value.channels?.forEach( a => 
                {
                    if(event.topic?.toString() == a)
                    {
                        const sender = value.socket;
                        this._socketResponse._idclient  = value._idclient;
                        this._socketResponse._iduser    = value._iduser;
                        this._socketResponse.message    = 'Nueva publicacion';
                        this._socketResponse.payload    = { 'post': event};
                        this._socketResponse.type       = TYPE_EVENTS.publish;

                        sender.send(JSON.stringify(this._socketResponse));
                    }
                });
            });
        });
        /** necesito llamar ahora a los procedimientos de socket */
    }

    /**
     * Function to publis a new post
     * @public
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

    /**
     * Function dedicated to watch all subscriptions event do it by a user
     * @public
     * @param {string} iduser 
     * @param {string} idtopic 
     * @returns Promise<_Response>
     */
    async OnSubscriptionHandler(idsuer, idtopic)
    {
        /** @type {import("../interfaces"._Response)} */
        const resp = await this._topicService.postOneTopicInUser(idsuer, idtopic);
        
        if(resp.status >= 200 && resp.status <= 202)
            this._emitter.emit(this._eventName[1], resp.data[0]);

        return resp;
    }

    /**
     * Function dedicated to watch all desubscriptions event do it by a user
     * @public
     * @param {string} iduser 
     * @param {string} idtopic 
     * @returns Promise<_Response>
     */
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
    async AreYouConnected(pckg, ws, next = () => {return})
    {

        if(/* LOGINCLUSTER.has(pckg._iduser) && */ CACHESESSIONS.find(a => a._iduser == pckg._iduser) === undefined)
        {

            const topics = await (await this._topicService.getAllTopicByUsrID(pckg._iduser)).data[0];

            const a = {
                '_iduser'   : pckg._iduser,
                '_idclient' : ++this.clients,
                'socket'    : ws,
                'channels'  : topics?.topics.map(a => a._id) || undefined,
                'idChannelsTable' : topics?._id || undefined
            };

            CACHESESSIONS.push(a);

            pckg.ok = true;
            pckg.type    = TYPE_EVENTS.login;
            pckg.message = "All fine!";
            pckg.payload = a;

        }
        
        if(/* LOGINCLUSTER.has(pckg._iduser) && */ CACHESESSIONS.find(a => a._iduser == pckg._iduser) !== undefined)
        {
            CACHESESSIONS.find( a => 
            {
                (a._iduser == pckg._iduser)? a.socket = ws : false;
            });
            
            pckg.ok = true;
            pckg.type    = TYPE_EVENTS.login;
            pckg.message = "Reconnected with new socket serial";
            pckg.payload = { 'ws': ws };
        }

        ws.send(JSON.stringify(pckg));
    }

    /**
     * Function dedicated to do a pingpong verify 
     * The system will send a package to verify if its online
     * if response true, have no problem, but if not
     * @private
     */
    async PINGPONG()
    {
        console.clear();
        console.log('Verificando usuarios conectados: \n', CACHESESSIONS);
        await CACHESESSIONS.forEach( value => 
        {
            this._socketResponse._idclient  = value._idclient;
            this._socketResponse._iduser    = value._iduser;
            this._socketResponse.message    = 'pingpong';
            this._socketResponse.ok         = false;
            this._socketResponse.type       = TYPE_EVENTS.pingpong;
            this._socketResponse.payload    = {};
            this._socketResponse.weight     = Buffer.byteLength(JSON.stringify(this._socketResponse));

            const ping = value.socket;
            ping.onmessage = (event) => {
                try 
                {
                    this._socketResponse = JSON.parse(value);
                    (!this._socketResponse.ok)?     
                        CACHESESSIONS = CACHESESSIONS.filter( a => a._iduser !== value._iduser) : false;

                } catch (error) 
                {
                    this._socketResponse._iduser    = value._idclient;
                    this._socketResponse._idclient  = 'DENIED';
                    this._socketResponse.message    = 'Corrupt package, cannot be served';
                    this._socketResponse.ok         = false;
                    this._socketResponse.payload    = { };
                    this._socketResponse.type       = TYPE_EVENTS.error;

                }
            };

            ping.send(JSON.stringify(this._socketResponse));
        });
    }

    /**
     * Function main to handle socket connection with a client
     * @public
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
                console.log('Incoming Package:', JSON.parse(event.toString('utf-8')));
                //incoming socket package
                inPkg = JSON.parse(event.toString('utf-8'));

                (inPkg.hasOwnProperty('_iduser') && inPkg.type === 1)? 
                   this.AreYouConnected(inPkg, ws) : rejectOpertion('Corrupt JSON');

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

        ws.on('close', (event) => { console.log( `Socket Cerrado: ${ws}`, event) });

        return ws;
    }
    
}


module.exports = PubsubService
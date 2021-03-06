const router   = require('express').Router;
const topics   = router(); 

const _tpcService    = require('../services/topics.service');
const _pubsubService = require('../services/pubsub.service');
const tpcService     = new _tpcService();
const pubsubService  = new _pubsubService();

topics.get('topic/controller', (req, res)=>
{
    /**@type {import('../interfaces')._Response} */
    const resp ={
        'message': 'Topic controller',
        'status': 200,
        'error': 'Nothing',
        'data': 'Route server operative',
        'OK': true
    }

    res.status(resp.status).json(resp);
})

topics.get('/topic/all', async (req, res)=>
{
    /**@type {import('../interfaces')._Response} */
    const resp = await tpcService.getAllTopicInDB();
    res.status(resp.status).json(resp);
})

topics.get('/topic/:id', async (req, res)=>
{
    /**@type {import('../interfaces')._Response} */
    const resp = await tpcService.getOneTopicByID(req.params.id);
    res.status(resp.status).json(resp);
})

topics.get('/topic/user/:user',async (req, res) => 
{
    /**@type {import('../interfaces')._Response} */
    const resp = await tpcService.getAllTopicByUsrID(req.params.user);
    res.status(resp.status).json(resp);
});

topics.post('/topic/save', async (req, res) => 
{
    const value = req.body?.name
    const resp = await tpcService.postOneTopic(value);

    res.status(resp.status).json(resp);
})

topics.post('/topic/usertopic/:user/:topic', async (req, res) => 
{
    /**@type {import('../interfaces')._Response} */
    const resp = await pubsubService.OnSubscriptionHandler(req.params.user, req.params.topic);

    res.status(resp.status).json(resp);
})

topics.put('/topic/modify/:id', async (req, res)=>
{
    /**@type {import('../interfaces')._Response} */
    const resp = await tpcService.modifyOneTopicByID(req.params.id, req.body?.name);
    res.status(resp.status).json(resp);
})

topics.delete('/topic/usertopic/:user/:topic', async (req, res) => 
{
    /**@type {import('../interfaces')._Response} */
    const resp = await pubsubService.DeSubscriptionHandler(req.params.user, req.params.topic);

    res.status(resp.status).json(resp);
})



module.exports = topics;
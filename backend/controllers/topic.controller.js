const router   = require('express').Router;
const topics   = router(); 

const _tpcService   = require('../services/topics.service');
const tpcService    = new _tpcService();

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

topics.post('/topic/save', async (req, res) => 
{
    const value = req.body?.name
    const resp = await tpcService.postOneTopic(value);

    res.status(resp.status).json(resp);
})

topics.post('/topic/usertopic', async (req, res) => 
{
    const {user, topic} = req.body
    const resp = await tpcService.postOneTopicInUser(user, topic);

    res.status(resp.status).json(resp);
})

topics.put('/topic/modify/:id', async (req, res)=>
{
    /**@type {import('../interfaces')._Response} */
    const resp = await tpcService.getAllTopicInDB();
    res.status(resp.status).json(resp);
})

topics.delete('/topic/usertopic', async (req, res) => 
{
    const {user, topic} = req.body
    const resp = await tpcService.deleteTopicInUserByUserID(user, topic);

    res.status(resp.status).json(resp);
})



module.exports = topics;
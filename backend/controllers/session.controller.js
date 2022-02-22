const router   = require('express').Router;
const session     = router(); 

const _lgnService   = require('../services/session.service');
const lgnService    = new _lgnService();

session.get('session/controller', (req, res)=>
{
    /**@type {import('../interfaces')._Response} */
    const resp ={
        'message': 'session controller',
        'status': 200,
        'error': 'Nothing',
        'data': 'Route server operative',
        'OK': true
    }

    res.status(resp.status).json(resp);
})

session.post('/session/register', async (req, res) => 
{
    const value = req.body;
    const resp = await lgnService._register(value);

    res.status(resp.status).json(resp);
})

session.post('/session/login', async (req, res) => 
{
    const value = req.body;
    const resp = await lgnService._login(value);

    res.status(resp.status).json(resp);
})

session.post('/session/logout/:id', async (req, res) => 
{
    const resp = await lgnService._logout(req.params.id);

    res.status(resp.status).json(resp);
})

module.exports = session;
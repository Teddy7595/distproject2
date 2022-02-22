const router   = require('express').Router;
const user     = router(); 

const _usrService = require('../services/user.service');
const usrService = new _usrService();

user.get('/controller', (req, res)=>
{
    /**@type {import('../interfaces')._Response} */
    const resp ={
        'message': 'User controller',
        'status': 200,
        'error': 'Nothing',
        'data': 'Route server operative',
        'OK': true
    }

    res.status(resp.status).json(resp);
})



module.exports = user;
const router   = require('express').Router;
const post   = router(); 

const _pstService   = require('../services/posts.service');
const _publisher    = require('../services/pubsub.service');
const pstService    = new _pstService();
const publisher     = new _publisher();

post.get('post/controller', (req, res)=>
{
    /**@type {import('../interfaces')._Response} */
    const resp ={
        'message': 'Post controller',
        'status': 200,
        'error': 'Nothing',
        'data': 'Route server operative',
        'OK': true
    }

    res.status(resp.status).json(resp);
})

post.get('/post/all/:topic', async (req, res)=>
{
    /**@type {import('../interfaces')._Response} */
    const resp = await pstService.getAllPostByTopic(req.params.topic);
    res.status(resp.status).json(resp);
})

post.get('/post/:id', async (req, res)=>
{
    /**@type {import('../interfaces')._Response} */
    const resp = await pstService.getOnePostByID(req.params.id);
    res.status(resp.status).json(resp);
})

post.post('/post/save', async (req, res) => 
{
    const {title, desc, topic} = req.body; 
    const resp = await publisher.PublishANewPost({title, desc, topic});

    res.status(resp.status).json(resp);
})

post.put('/post/modify/:id', async (req, res)=>
{
    /**@type {import('../interfaces')._Response} */
    const resp = await pstService.modifyOnePostcByID(req.params.id, req.body);
    res.status(resp.status).json(resp);
})

post.delete('/post/delete/:id', async (req, res) => 
{
    const {user, topic} = req.body
    const resp = await pstService.deleteOnePost(req.params.id);

    res.status(resp.status).json(resp);
})

module.exports = post;
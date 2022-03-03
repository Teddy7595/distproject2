const dataservice = require('./data.service');
const topicsModel = require('../data/topics.model');
const postModel = require('../data/posts.model');
const cachePost = require('../config').CACHECLUSTER;

class PostService
{   
    /**@private */
    _dataService
    /**@private */
    _postModel
    /**@private */
    _topicsModel
    
    constructor()
    {
        console.log('Servicio de Posts...');
        this._dataService = new dataservice();
        this._topicsModel = topicsModel;
        this._postModel = postModel;
    }

    /**
     * Function to get all the post by specific topic
     * @param {string} topic 
     */
    async getAllPostByTopic(topic)
    {
        /**@type {import('../interfaces')._argsFind} */
        const _args = {'findObject': {'topic': topic}, 'select': '-__v'}
        /**@type {import('../interfaces')._Response} */
        const resp = await this._dataService._findAllDB(this._postModel, _args);

        return resp;
    }

    /**
     * Function to get an post by specific id
     * @param {string} id 
     */
    async getOnePostByID(id)
    {
        /**@type {import('../interfaces')._argsFind} */
        const _args = {'findObject': {'_id': id}, 'select': '-__v'}
        /**@type {import('../interfaces')._Response} */
        const resp = await this._dataService._findOneInDB(this._postModel, _args);

        return resp;
    }

    /**
     * Function to save a new post
     * @param {{'topic':string, 'title':string, 'desc':string}} post 
     */
    async createOnePost(post, next = (a) => a)
    {
        const data = new this._postModel(post);
        /**@type {import('../interfaces')._Response} */
        let resp = {};
        try {
            resp = await this._dataService._saveDB(data);
            
        } catch (error) {
            resp.OK = false;
            resp.error = error;
            resp.status = 500;
            next(resp);
        }

        return resp;
    }

    /**
     * function to modify a topic, finding first by ID
     * @param {string} id
     * @param {{'topic':string, 'title':string, 'description':string}} post 
     */
    async modifyOnePostcByID(id, post)
    {
        /**@type {import('../interfaces')._argsUpdate} */
        const _args ={
            'findObject': {'_id': id},
            'set': {$set: post }
        }
 
        /**@type {import('../interfaces')._Response} */
        let resp = await this._dataService._updateOneInDB(this._postModel, _args);
        resp.data = await (await this._dataService._findOneInDB(this._postModel, _args)).data;
 
        return resp;
    }

    /**
     * Function to delete an post by ID
     * @param {string} id 
     */
    async deleteOnePost(id)
    {
        const resp = this._dataService._hardDelete(this._postModel, id);
 
        return resp;
    }
}

module.exports = PostService;
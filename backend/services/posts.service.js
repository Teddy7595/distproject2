const dataservice = require('./data.service');
const topicsModel = require('../data/post.model');
const postModel = require('../data/topics.model');

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
}
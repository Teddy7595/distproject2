const dataservice = require('./data.service');
const topicsModel = require('../data/topics.model');
const tpcUsrModel = require('../data/topics_users.model');

class TopicsService
{   
    /**@private */
    _dataService
    /**@private */
    _topicsModel
    /**@private */
    _tpcUsrModel
    
    constructor()
    {
        this._dataService = new dataservice();
        this._topicsModel = topicsModel;
        this._tpcUsrModel = tpcUsrModel;

        console.log(this._dataService);
    }

    /**
     * Funtcion to get a topic using topic ID
     * @param {string} value 
     * @returns Promise<_Response>
     */
    async getOneTopicByID(value)
    {
        /**@type {import('../interfaces')._argsFind} */
        const _args = {'findObject': {'_id': value}, 'select': '-__v'}
        /**@type {import('../interfaces')._Response} */
        const resp = await this._dataService._findOneInDB(this._topicsModel, _args);

        return resp;
    }

    /**
     * Funtcion to returns all topics created
     * @returns Promise<_Response>
     */
    async getAllTopicInDB()
    {
         /**@type {import('../interfaces')._Response} */
         const resp = await this._dataService._findAllDB(this._topicsModel, { });
 
         return resp;
    }

    /**
     * Funtcion to get a topic using user ID and topic name
     * @param {string} usr 
     * @param {string} tpic
     * @returns Promise<_Response>
     */
    async getOneTopicByUsrID(usr, tpic)
    {
        /**@type {import('../interfaces')._argsFind} */
        const _args = {'findObject': {'userID': usr}, 'select': '-__v'}
        /**@type {import('../interfaces')._Response} */
        const resp = await this._dataService._findOneInDB(this._tpcUsrModel, _args);
        
        (resp.status >= 200 && resp.status < 203)? 
            resp.data = resp.data.find( value => value?.topic === tpic): 
            false;

        return resp;
    }

    /**
     * Funtcion to get a topic using user ID and topic name
     * @param {string} usr 
     * @param {string} tpic
     * @returns Promise<_Response>
     */
    async getAllTopicByUsrID(usr, tpic)
    {
        /**@type {import('../interfaces')._argsFind} */
        const _args = {'findObject': {'userID': usr}, 'select': '-__v'}
        /**@type {import('../interfaces')._Response} */
        const resp = await this._dataService._findOneInDB(this._tpcUsrModel, _args);
 
        return resp;
    }

    /**
     * Funtcion to get a topic using ID topic
     * @param {string} value
     * @returns Promise<_Response>
     */
    async getOneTopicID(value)
    {
        /**@type {import('../interfaces')._argsFind} */
        const _args = {'findObject': {'_id': value}, 'select': '-__v'}
        /**@type {import('../interfaces')._Response} */
        const resp = await this._dataService._findOneInDB(this._topicsModel, _args);

        return resp;
    }

    /**
     * Funtcion to post a topic in the database
     * @param {string} value 
     * @returns Promise<_Response>
     */
    async postOneTopic(value)
    {
        const data = new this._topicsModel({ 'name': value});

        /**@type {import('../interfaces')._Response} */
        const resp = await this._dataService._saveDB(data);
        return resp;
    }

    /**
     * function to modify a topic, finding first by ID
     * @param {string} id
     * @param {string} name
     */
    async modifyOneTopicByID(id, name)
    {
        /**@type {import('../interfaces')._argsUpdate} */
        const _args ={
            'findObject': {'_id': id},
            'set': {'topic': name}
        }

        const resp = await this._dataService._updateOneInDB(this._topicsModel, _args);

        return resp;
    }


}

module.exports = TopicsService
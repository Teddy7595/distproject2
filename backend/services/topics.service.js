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
        console.log('Servicio de Temas/Topicos...');
        this._dataService = new dataservice();
        this._topicsModel = topicsModel;
        this._tpcUsrModel = tpcUsrModel;
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
        const _args = {
            'findObject': {'userID': usr}, 
            'select': '-__v',
            'populate':[{
                'path': 'Topics',
                'select': 'topic'
            }]
        }
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
     * @returns Promise<_Response>
     */
    async getAllTopicByUsrID(usr)
    {
        /**@type {import('../interfaces')._argsFind} */
        const _args = {
            'findObject': {'userID': usr}, 
            'select': '-__v',
            'populate':[{
                'path': 'Topics',
                'select': 'topic'
            }]
        }
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
        const data = new this._topicsModel({ 'topic': value});

        /**@type {import('../interfaces')._Response} */
        const resp = await this._dataService._saveDB(data).catch(e => console.log(e));
        return resp;
    }

    /**
     * Funtcion to post a topic in the user stack
     * @param {string} user
     * @param {string} idtopic 
     * @returns Promise<_Response>
     */
    async postOneTopicInUser(user, idtopic)
    {
        
        /**@type {import('../interfaces')._argsFind} */
        const _args = {'findObject': {'userID': user}, 'select': '-__v'}
        /**@type {import('../interfaces')._Response} */
        let resp = await this._dataService._findOneInDB(this._tpcUsrModel, _args);

        if(resp.data.length <= 0 || resp.data[0] === null)
        {
            const data = new this._tpcUsrModel({ 
                'topics': [idtopic],
                'userID': user
            });

            resp = await this._dataService._saveDB(data);
        }

        if(resp.data.length > 0)
        {
            /**@type {import('../interfaces')._argsUpdate} */
            const _args ={
                'findObject':{'userID':user},
                'set':{$set: {topics: [idtopic, ...resp.data[0]?.topics]}}
            }

            resp = await this._dataService._updateOneInDB(this._tpcUsrModel, _args);
            resp.data = await (await this._dataService._findOneInDB(this._tpcUsrModel, _args)).data;
        }

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

        /**@type {import('../interfaces')._Response} */
        let resp = await this._dataService._updateOneInDB(this._topicsModel, _args);
        resp.data = await (await this._dataService._findOneInDB(this._topicsModel, _args)).data;

        return resp;
    }

    /**
     * Function to delete a element in a usertopics stack
     * @param {string} user 
     * @param {string} topic 
     */
    async deleteTopicInUserByUserID(user, topic)
    {
        /**@type {import('../interfaces')._argsFind} */
        const _args = {'findObject': {'userID': user}, 'select': '-__v'}

        /**@type {import('../interfaces')._Response} */
        let resp = await this._dataService._findOneInDB(this._tpcUsrModel, _args);

        if(resp.data.length > 0 && resp.data[0] != null)
        {
            /** @type {{'_id':string, topics:Array<string>, userID:string}} */
            const value = resp.data[0];

            const index = value.topics.indexOf(topic.toString());
            (value.topics.length === 1)? 
                value.topics.pop() : 
                value.topics.slice(index, 0);

            /**@type {import('../interfaces')._argsUpdate} */
            const _args ={
                'findObject':{'userID':user},
                'set':{$set: {topics: value.topics}}
            }

            resp = await this._dataService._updateOneInDB(this._tpcUsrModel, _args);
        }

        return resp;
    }


}

module.exports = TopicsService
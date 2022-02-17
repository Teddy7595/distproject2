const _data = require('../services/data.service');
const _user = require('../data/user.model');

class UserService
{
    /** @private */
    _userModel;

    constructor()
    {
        console.log('Servicio de manipulacion de usuarios');
        this._dataService = new _data();    
        this._userModel = _user;   
    }

    /**
     * @param {import('../interfaces').userLog} value
     * @return Promise<_Response> 
     */
    async _register(value)
    {
        /** @type {import('../interfaces')._Response} */
        let resp ={
            'message': 'No se logro registrar el nuevo usuario',
            'status': 400,
            'error': 'Unknown',
            'data': [],
            'OK': false
        };

        if (value.user && value.pass) 
        {      
            let data = new this._userModel(value);
            resp = await this._dataService._saveDB(data)    
        }

        return resp;
    }

    /**
     * @param {import('../interfaces').userLog} value
     * @return Promise<_Response> 
     */
    async _login(value)
    {
        /** @type {import('../interfaces')._Response} */
        let resp ={
            'message': 'Datos incorrectos, revisa lo que haces...',
            'status': 400,
            'error': 'Unknown',
            'data': [],
            'OK': false
        };

        if (value.user && value.pass) 
        {      
            /**@type {import('../interfaces')._argsFind} */
            const args = {'findObject': value, 'select': '-__v'};
            resp = await this._dataService._findOneInDB(this._userModel, args);    
        }

        return resp;
    }


}

module.exports = UserService;
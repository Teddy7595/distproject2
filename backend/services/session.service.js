const _data = require('./data.service');
const _user = require('../data/user.model');
const _loginCluster = require('../config').LOGINCLUSTER;

class UserService
{
    /** @private */
    _userModel;
    /** @private */
    _dataService;
    
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
            
            if(resp.data[0] !== null && !_loginCluster.has(resp.data[0]?._id.toString()))
                _loginCluster.add(resp.data[0]?._id.toString());
           
            if(value.pass !== resp.data[0]?.pass.toString())
            {
                resp.status = 400;
                resp.OK = false;
                resp.data = [];
                resp.message = "Password or username incorrect"
            }
        }
        console.log(_loginCluster);
        return resp;
    }

    /**
     * Function to delete the session trace in server
     * @param {string} value 
     */
    async _logout(value)
    {
        /** @type {import('../interfaces')._Response} */
        let resp ={
            'message': 'Cerrando session...',
            'status': 0,
            'error': 'Nothing',
            'data': value,
            'OK': false
        };

        _loginCluster.delete(value);

        resp.OK = !_loginCluster.has(value);
        resp.status = (_loginCluster.has(value))? 400 : 200;

        console.log(_loginCluster);
        return resp;

    }
}

module.exports = UserService;
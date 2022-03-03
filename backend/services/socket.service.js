/**service dedicated to handle all element refered with sockets */
const { WebSocket } = require('ws');
const session       = require('../config').LOGINCLUSTER; 

class SocketService
{

    /** TODO
     * Generar la session de socket
     * Modificar la sesion de socket
     * Sistem de broadcasting
     * Eleminar una session
     * Cerrar un session
     */

    constructor()
    {
        
    }


    async areYouConnected(id)
    {
        console.log(session.has(id));
    }
}

module.exports = SocketService;

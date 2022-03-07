/**
 * Container to save temporally all userid that having a connection with the server
 * @type {Set<string>} 
 * */
const LOGINCLUSTER = new Set();

/** @type {Array<{'_iduser':string, '_idclient':string, 'channels':Array<string>, socket: WebSocket, idTopicsTable: string}>} */
const CACHESESSIONS = new Array();

const TYPE_EVENTS =
{
    'error'         : 0,
    'login'         : 1,
    'logout'        : 2,
    'publish'       : 3,
    'response'      : 4,
    'pingpong'      : 5,
    'subscript'     : 6
}

module.exports = {LOGINCLUSTER, CACHESESSIONS, TYPE_EVENTS}
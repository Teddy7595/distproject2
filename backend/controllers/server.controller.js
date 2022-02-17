const express = require('express');
const srv  = express();

//Establish a basic route to test server response
srv.get('/alive', (req, res) =>
{   
    /** @type {import('../types').srvResponse | undefined} */
    let response =
    {
        OK: true,
        data: [ {project: process.env.NAME, port: process.env.ENV_PORT} ],
        status: 200,
        message: "Server online and ready to the action!",
        error: "Nothing"
    }

    return res.status(response.status || 400).json(response);
});

module.exports = srv;





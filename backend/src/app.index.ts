import express from 'express';

//function to user like entry point to run server
async function main() 
{   
    console.clear();
    const APP = express();

    APP.listen(8080, ()=> console.log('Arrancando servicio'));
}

main();
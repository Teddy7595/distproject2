const cron  = require('node-cron');
const fetch = require('node-fetch');

const _SERVER   = "http://localhost:8081/api/";

console.log('¡Bienvenido al publicador de Ofertas laborales!');
console.log('Agregando canales: \n');

const _CHANNELS = [
    "62259167b0e2f2618079872b",
    "62259167b0e2f2618079872e",
    "62259167b0e2f26180798731",
    "62259167b0e2f26180798734",
    "62259167b0e2f26180798737",
    "62259167b0e2f2618079873a"
];

let cont = 0;

var task = cron.schedule('*/10 * * * * *', () => 
{
    console.log(`Generando oferta nro ${cont}`);

    const _POST = {
        "title": `Oferta nro ${cont}`,
        "desc": `Lorem, ipsum dolor sit amet 
                consectetur adipisicing elit. 
                Reiciendis esse minima voluptas earum, 
                at porro impedit magni, amet natus ut, 
                omnis laborum eum provident a nobis rerum 
                magnam soluta deleniti?`,
        "topic": _CHANNELS[Math.floor(Math.random() * 6)]
    };

    fetch('http://localhost:8081/api/post/save', 
    {
        method: 'POST',
        body: JSON.stringify(_POST),
        headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json())
    .then(json => console.log(json))
    .catch(err => console.log(err));
        
    ++cont;
});

task.start();

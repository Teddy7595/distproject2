const _SOCKET   = "ws://localhost:8081/stream";
const _SERVER   = "http://localhost:8081/api/";
const _USER     = JSON.parse(localStorage.getItem('user'));
const TYPE_EVENTS =
{
    'error'         : 0,
    'login'         : 1,
    'logout'        : 2,
    'publish'       : 3,
    'response'      : 4,
    'pingpong'      : 5,
    'subscript'     : 6
};

/** @type {Array<{_id:string, topic:string}>} */
let _CHANNELS = [];

/** @type {Array<{_id:string, topic:string}>} */
let _USRCHANNELS = [];

let _SOCKETPACKAGE = { 
    '_idclient' : ' ',
    '_iduser'   : ' ',
    'message'   : ' ',
    'ok'        : false,
    'payload'   : { },
    'type'      : 0,
    'weight'    : ' '
};

_USER._id = '622594063a09c762809f7997';

/**
 * @param {HTMLElement} checkbox
 */
async function CheckBoxHandler(checkbox)
{
    
    const CHKBX = {
        "user":  _USER?._id,
        "topic": checkbox.getAttribute('id')
    };

    if(checkbox.checked)
    {
        const _ONSUBCRIPTION = _SERVER+`topic/usertopic/${CHKBX.user}/${CHKBX.topic}`;
        const _RESPONSE = await fetch(_ONSUBCRIPTION, {'method': 'POST'}).then(e => e.json());

    }else
    {
        const _DESUBCRIPTION = _SERVER+`topic/usertopic/${CHKBX.user}/${CHKBX.topic}`;
        const _RESPONSE = await fetch(_DESUBCRIPTION, {'method': 'DELETE'}).then(e => e.json());
    }
}

async function InitSession()
{
    console.log('LLAMANDO CANALES DISPONIBLES')
    const _TOPICS    = _SERVER + 'topic/all';
    const _USRTOPICS = _SERVER + 'topic/user/' + _USER._id;

    try {
        _CHANNELS    = await fetch(_TOPICS, {'method': 'GET'}).then(e => e.json()).then( data => data?.data);
        _USRCHANNELS = await fetch(_USRTOPICS, {'method': 'GET'}).then(e => e.json()).then( data => data?.data[0].topics).catch(e => console.log(e));

        _CHANNELS?.forEach( value =>
        {
            const listItem  = document.createElement("li");
            const chckBttn  = document.createElement("input");
            const itemBttn  = document.createElement("label"); 
            const listGrid  = document.getElementById("sidebar");

            itemBttn.textContent = value.topic;
            chckBttn.setAttribute('id', value._id);
            chckBttn.setAttribute('type', 'checkbox');

            listItem.appendChild(chckBttn);
            listItem.appendChild(itemBttn);
            listGrid.appendChild(listItem);

            chckBttn.addEventListener('click', async () => await CheckBoxHandler(chckBttn));
        });

        _USRCHANNELS?.forEach( value => 
        {
            const CHANNEL = document.getElementById(value._id);
            CHANNEL.setAttribute('checked', 'true');
        });
    } catch (error) {
        console.log(error);
    }


}

const EventTypeHandler = 
{
    /**@param {_SOCKETPACKAGE} value */
    1: (value) =>
    {
        console.log(value)
    },
    /**@param {_SOCKETPACKAGE} value */
    2: (value) =>
    {
        console.log(value)
    },
    /**@param {_SOCKETPACKAGE} value */
    3: (value) =>
    {
        const title = document.createElement('h3');
        title.textContent = value.payload?.post.title;

        const descn = document.createElement('p');
        descn.textContent = value.payload?.post.desc;
        
        const channel = document.createElement('span');
        _CHANNELS.forEach( a =>
        {
            (a._id === value.payload?.post.topic)? 
                channel.textContent = a.topic : false;
        })

        const li = document.createElement('li');
        li.appendChild(title);
        li.appendChild(descn);
        li.appendChild(channel);

        const ul = document.getElementById('body');
        ul.appendChild(li);

        console.log(value);
    },
    /**@param {_SOCKETPACKAGE} value */
    5: (value) =>
    {
        value.ok = true;
        ws.send(JSON.stringify(value));
    }
}

const ws = new WebSocket(_SOCKET, ['procotolOne', 'protocolTwo']);

console.log(_USER);

ws.onopen = async () => 
{
    _SOCKETPACKAGE._iduser  = _USER?._id;
    _SOCKETPACKAGE.type     = TYPE_EVENTS.login;
    _SOCKETPACKAGE.ok       = true;
    ws.send(JSON.stringify(_SOCKETPACKAGE));
}

ws.onmessage = (event) => 
{
    _SOCKETPACKAGE = JSON.parse(event.data);
    (_SOCKETPACKAGE.type === TYPE_EVENTS.login)? EventTypeHandler[TYPE_EVENTS.login](_SOCKETPACKAGE) : false;
    (_SOCKETPACKAGE.type === TYPE_EVENTS.publish)? EventTypeHandler[TYPE_EVENTS.publish](_SOCKETPACKAGE) : false;
    (_SOCKETPACKAGE.type === TYPE_EVENTS.pingpong)? EventTypeHandler[TYPE_EVENTS.pingpong](_SOCKETPACKAGE) : false;
}

InitSession();
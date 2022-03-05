const _USER = { 'user': ' ', 'pass': ' '};

/////////////////////////////////////////////////////login script

const _LOGIN = 'http://localhost:8081/api/session/login';
const _REDIRECT = 'http://localhost:8080/grid';

const LOGBTT = document.getElementById('logBTT');

const getDataToLogin = () =>
{
    _USER.user = document.getElementById('floatingInput').value;
    _USER.pass = document.getElementById('floatingPassword').value;
}

LOGBTT.addEventListener('click', async (event) => 
{
    event.preventDefault();
    getDataToLogin();

    await fetch(_LOGIN, {
        method: 'POST',
        body: JSON.stringify(_USER),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    }).then( data => data.json()).then( a => 
    {
        if(a.status === 200)
        {
            localStorage.setItem('user', JSON.stringify(a?.data[0] ?? {}));
            window.location.href = _REDIRECT;
        }
        else{alert(a.error);}
    });

    
});
const _USER = { 'user': ' ', 'pass': ' '};

const _REGISTER = 'http://localhost:8081/api/session/register';
const _REDIRECT = 'http://localhost:8080/grid';

/////////////////////////////////////////////////////register script
const REGBTT = document.getElementById('regBTT');

const getDataToRegister = () =>
{
    _USER.user = document.getElementById('floatingInput').value;
    _USER.pass = document.getElementById('floatingPassword').value;
}

REGBTT.addEventListener('click', async (event) => 
{
    event.preventDefault();
    getDataToRegister();

    const user = await fetch(_REGISTER, {
        method: 'POST',
        body: JSON.stringify(_USER),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    }).then( data => data.json()).then( a => 
    {
        if(a.status === 201)
        {
            localStorage.setItem('user', JSON.stringify(a?.data[0] ?? {}));
            window.location.href = _REDIRECT;
        }
        else{alert(a.error);}
    });
});


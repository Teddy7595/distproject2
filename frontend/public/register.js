const _USER = { 'user': ' ', 'pass': ' '};

const _SERVER = 'http://localhost:8081/api/session/register';

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

    console.log(await (await fetch(_SERVER, {
        method: 'POST',
        body: JSON.stringify(_USER),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    })).json());
});
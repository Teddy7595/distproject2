/**
* function to reduce all empty promise returned
* @param {Array<{status:String, value:Object}>} param
* @returns {Promise<Array<{status:String, value:Object} | any>>} response
*/
async function reduceEmptyPromise(param)
{
    /**@type {Array<Object | any>} */
    let response = [{}];
    response.pop();

    for(const data of param)
        if(data.value.length > 0) 
            for(const i of data.value)
                response.push(i)
    
    return response;
}

/**
* function to try find and return a specific Object in an Object Array
* @param {Array<Object>} array
* @param {String} property
* @param {String} propValue
* @returns {Promise<Object>} response
*/
async function findOneInObjectArray(array, property, propValue)
{
    /**@type {Object} */
    let response = {};

    await array.forEach( (value) => 
    {
        for(const i in value)
            if(i.match(property))
                (value[i] === propValue)? 
                    response = value : false; 
    });

    return response;
}

/**
* function to rdirect
* @param {String} param
* @returns {void}
*/
function redirectTo(param) 
{
    
}

/**
* function to shutting down a service thread
* @param {String} param
* @returns {void}
*/
function rejectOpertion(param) 
{
    throw new Error(param);
}

module.exports = {reduceEmptyPromise, findOneInObjectArray, redirectTo, rejectOpertion};
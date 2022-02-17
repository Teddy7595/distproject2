/**
 * In this script i try to recreate a section of hexagonal architecture, service dedicated only manage 
 * the inputs and outputs of the databa base
 */

class DataService
{
        /**
     * @param {any} dataBody 
     * @param { import("../interfaces")._argsFind } parameters
     * @returns {Promise< import("../interfaces").srvResponse >} 
     */
    async  _findOneInDB(dataBody, parameters) 
    {
        return new Promise( async (resolve, reject) =>
        {
            await dataBody.findOne(parameters.findObject)
                .populate(parameters.populate)
                .select(parameters.select)
                .exec( (err, response) =>
                {
                    if(err)
                    {
                        /**@type {import("../interfaces").srvResponse} */
                        const resp =
                        {
                            OK: true,
                            status: 404,
                            data: [],
                            message: "Ocurrió un problema o no se encontró el dato",
                            error: err
                        }

                        reject(resp);
                    }

                    /**@type {import("../interfaces").srvResponse} */
                    const resp =
                    {
                        OK: true,
                        status: 200,
                        data: [response],
                        message: "Datos encontrados!",
                        error: "Nothing"
                    }

                    resolve(resp);
                });
        });
    }

    /**
     * @param {any} dataBody 
     * @param { import("../interfaces")._argsFind } parameters
     * @returns {Promise< import("../interfaces").srvResponse >} 
     */
    async  _findAllDB(dataBody, parameters)
    {
        return new Promise( async (resolve, reject)=>
        {
            await dataBody.find(parameters.findObject)
                .populate(parameters.populate)
                .select(parameters.select)
                .exec( (err, response) =>
                {
                    if(err)
                    {
                        /**@type {import("../interfaces").srvResponse} */
                        const resp =
                        {
                            OK: false,
                            status: 500,
                            data: [],
                            message: "Ocurrió un problema o no se encontró el dato",
                            error: err
                        }

                        reject(resp);
                    }

                    if(!response)
                    {
                        /**@type {import("../interfaces").srvResponse} */
                        const resp =
                        {
                            OK: true,
                            status: 404,
                            data: [],
                            message: "No se encontró lo que se solicitó",
                            error: "Nothing find"
                        }

                        resolve(resp);
                    }

                    if(response)
                    {
                        /**@type {import("../interfaces").srvResponse} */
                        const resp =
                        {
                            OK: true,
                            status: 200,
                            data: response,
                            message: "Existe data!",
                            error: "Something find"
                        }

                        resolve(resp);
                    }
                });
        });
    }

    /**
     * @param {any} dataBody 
     * @returns {Promise< import("../interfaces").srvResponse >} 
     */
    async  _saveDB(dataBody)
    {
        return new Promise( async (resolve, reject) =>
        {
            await dataBody.save((err, response) => 
            {
                if (err)
                {
                    /**@type {import("../interfaces").srvResponse} */
                    const resp =
                    {
                        OK: true,
                        status: 400,
                        data: [],
                        message: "Ocurrió un problema al guardar la data",
                        error: err
                    }

                    reject(resp);
                }

                /**@type {import("../interfaces").srvResponse} */
                const resp =
                {
                    OK: true,
                    status: 201,
                    data: [response],
                    message: "Exito generando un nuevo registro!",
                    error: "Nothing"
                }

                resolve(resp);
            });
        });
    }

    /**
     * @param {any} dataBody 
     * @param { import("../interfaces")._argsUpdate } parameters
     * @returns {Promise< import("../interfaces").srvResponse >} 
     */
    async  _updateOneInDB(dataBody, parameters)
    {
        return await new Promise( async (resolve, reject) =>
        {
            await dataBody.updateMany(
                parameters.findObject, 
                parameters.set, 
                {new: true}, 
                async (err, response)=>
                {
                    if(err)
                    {
                        /** @type {import("../interfaces").srvResponse} */
                        const resp =
                        {
                            OK: false,
                            status: 500,
                            data: [],
                            message: "Ocurrió un problema al actualizar la data",
                            error: err
                        }

                        reject(resp);
                    }

                    if(!response)
                    {
                        /** @type {import("../interfaces").srvResponse} */
                        const resp =
                        {
                            OK: true,
                            status: 400,
                            data: [],
                            message: "No pudimos encontrar el elemento a actualizar",
                            error: "Nothing"
                        }

                        reject(resp);
                    }

                    if(response)
                    {
                        /** @type {import("../interfaces").srvResponse} */
                        const resp =
                        {
                            OK: true,
                            status: 200,
                            data: [response],
                            message: "Elemento actualizado con exito!",
                            error: "Nothing"
                        }

                        resolve(resp);
                    }
                });
        });
    }

    /**
     * @param {any} dataBody
     * @param {string} id 
     * @returns {Promise< import("../interfaces").srvResponse >} 
     */
    async  _hardDelete(dataBody, id)
    {
        return new Promise( async (resolve, reject)=>
        {
            await dataBody.deleteOne({_id: id})
                .exec( (err, response) =>
                {
                    if(err)
                    {
                        /**@type {import("../interfaces").srvResponse} */
                        const resp =
                        {
                            OK: false,
                            status: 500,
                            data: [],
                            message: "Ocurrió un problema o no se encontró el dato",
                            error: err
                        }

                        reject(resp);
                    }

                    if(!response)
                    {
                        /**@type {import("../interfaces").srvResponse} */
                        const resp =
                        {
                            OK: true,
                            status: 404,
                            data: [],
                            message: "No se encontró lo que se solicitó",
                            error: "Nothing find"
                        }

                        resolve(resp);
                    }

                    if(response)
                    {
                        /**@type {import("../interfaces").srvResponse} */
                        const resp =
                        {
                            OK: true,
                            status: 200,
                            data: response,
                            message: "Se ha borrado el elemento!!",
                            error: "Nothing"
                        }

                        resolve(resp);
                    }
                });
        });
    }
}

module.exports = DataService;
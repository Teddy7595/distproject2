/**
 * In this script i try to recreate a section of hexagonal architecture, service dedicated only manage 
 * the inputs and outputs of the databa base
 */


async function _findOneInDB(dataBody: any, parameters: any) {
    return new Promise(async (resolve, reject) => {
        await dataBody.findOne(parameters.findObject)
            .populate(parameters.populate)
            .select(parameters.select)
            .exec((err: any, response: any) => {
                if (err) {
                    /**@type {import("../types")._Response} */
                    const resp =
                    {
                        OK: true,
                        status: 404,
                        data: Array,
                        message: "Ocurrió un problema o no se encontró el dato",
                        error: err
                    }

                    reject(resp);
                }

                /**@type {import("../types")._Response} */
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


async function _findAllDB(dataBody: any, parameters: any) {
    return new Promise(async (resolve, reject) => {
        await dataBody.find(parameters.findObject)
            .populate(parameters.populate)
            .select(parameters.select)
            .exec((err: any, response: any) => {
                if (err) {
                    /**@type {import("../types")._Response} */
                    const resp =
                    {
                        OK: false,
                        status: 500,
                        data: Array,
                        message: "Ocurrió un problema o no se encontró el dato",
                        error: err
                    }

                    reject(resp);
                }

                if (!response) {
                    /**@type {import("../types")._Response} */
                    const resp =
                    {
                        OK: true,
                        status: 404,
                        data: Array,
                        message: "No se encontró lo que se solicitó",
                        error: "Nothing find"
                    }

                    resolve(resp);
                }

                if (response) {
                    /**@type {import("../types")._Response} */
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


async function _saveDB(dataBody: any) {
    return new Promise(async (resolve, reject) => {
        await dataBody.save((err: any, response: any) => {
            if (err) {
                /**@type {import("../types")._Response} */
                const resp =
                {
                    OK: true,
                    status: 400,
                    data: Array,
                    message: "Ocurrió un problema al guardar la data",
                    error: err
                }

                reject(resp);
            }

            /**@type {import("../types")._Response} */
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


async function _updateOneInDB(dataBody: any, parameters: any) {
    return await new Promise(async (resolve, reject) => {
        await dataBody.updateMany(
            parameters.findObject,
            parameters.set,
            { new: true },
            async (err: any, response: any) => {
                if (err) {
                    /** @type {import("../types")._Response} */
                    const resp =
                    {
                        OK: false,
                        status: 500,
                        data: Array,
                        message: "Ocurrió un problema al actualizar la data",
                        error: err
                    }

                    reject(resp);
                }

                if (!response) {
                    /** @type {import("../types")._Response} */
                    const resp =
                    {
                        OK: true,
                        status: 400,
                        data: Array,
                        message: "No pudimos encontrar el elemento a actualizar",
                        error: "Nothing"
                    }

                    reject(resp);
                }

                if (response) {
                    /** @type {import("../types")._Response} */
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


async function _hardDelete(dataBody: any, id: any) {
    return new Promise(async (resolve, reject) => {
        await dataBody.deleteOne({ _id: id })
            .exec((err: any, response: any) => {
                if (err) {
                    /**@type {import("../types")._Response} */
                    const resp =
                    {
                        OK: false,
                        status: 500,
                        data: Array,
                        message: "Ocurrió un problema o no se encontró el dato",
                        error: err
                    }

                    reject(resp);
                }

                if (!response) {
                    /**@type {import("../types")._Response} */
                    const resp =
                    {
                        OK: true,
                        status: 404,
                        data: Array,
                        message: "No se encontró lo que se solicitó",
                        error: "Nothing find"
                    }

                    resolve(resp);
                }

                if (response) {
                    /**@type {import("../types")._Response} */
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

export { _findAllDB, _findOneInDB, _saveDB, _updateOneInDB, _hardDelete };
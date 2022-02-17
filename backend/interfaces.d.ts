//data type to describe general server response to client 
export type _Response =
{
    OK:      boolean,
    data:    [], 
    error:   string,  
    status:  number,  
    message: string,   
}

//data type to describe parameters to find in database
export type _argsFind = 
{
    findObject: any;
    populate?: any;
    select?: any;
}

//data type to describe parameters to update a object in database
export type _argsUpdate =
{
    findObject: any;
    set: any;
    populate?: any;
}

/** data type to send information between server and client through the socket */
export type socketPackage =
{
    _idclient?:     string,        
    _iduser?:       string,        
    type?:          number,        
    message?:       string,
    payload?:       any,           
    weight?:        string,
    ok?:            boolean
}

/** index to describe all type of event in server and client connected */
export enum event_type
{

}



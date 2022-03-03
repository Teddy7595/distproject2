//data interface to describe general server response to client 
export interface _Response 
{
    OK:      boolean,
    data:    [], 
    error:   string,  
    status:  number,  
    message: string,   
}

//data interface to describe parameters to find in database
export interface _argsFind  
{
    findObject: any;
    populate?: any;
    select?: any;
}

//data interface to describe parameters to update a object in database
export interface _argsUpdate 
{
    findObject: any;
    set: any;
    populate?: any;
}

/** data interface to send information between server and client through the socket */
export interface socketPackage 
{
    _idclient?:     string,        
    _iduser?:       string,        
    type?:          number,        
    message?:       string,
    payload?:       any,           
    weight?:        string,
    ok?:            boolean
}

/**data interface to describe information required to a user can login or register */
export interface userLog
{
    user?: string,
    pass?: string
}

/**data interface to describe a socket session inner server */
export interface socketSession
{
    _iduser:    string,
    _idcliente: string,
    
}




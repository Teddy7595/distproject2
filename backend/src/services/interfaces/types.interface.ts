/**data type to describe general server response to client  */
export interface _Response 
{
    OK:      boolean,
    data:    any[], 
    error:   string,  
    status:  number,  
    message: string,   
}

/** data type to send information between server and client through the socket */
export interface iPackage 
{
    _idclient?:     string,        //id of anyone client that make connection with the server
    type?:          number,        //describe event type or type of package that its sended or received
    payload?:       any,           //data can be {nickname, message} or other...
    weight?:        string         //value to describe weight of package
}

//data type to describe parameters to find in database
export interface _argsFind  
{
    findObject: any;
    populate?: any;
    select?: any;
}

//data type to describe parameters to update a object in database
export interface _argsUpdate 
{
    findObject: any;
    set: any;
    populate?: any;
}

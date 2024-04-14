import { UNAUTHORIZED } from "http-status";
import CustomError from "./customError";

export class UnAuthorized extends CustomError{
    statusCode:number;
    constructor(message:string){
        super(message)
        this.statusCode = UNAUTHORIZED;
    }
}

export default UnAuthorized;
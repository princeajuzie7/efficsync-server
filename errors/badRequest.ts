import CustomError from "./customError";
import httpStatus from "http-status";

export class BadRequestError extends CustomError {
    statusCode:number;

    
    constructor(message: string){
        super(message)
        this.statusCode = httpStatus.BAD_REQUEST;
    }


}

export default BadRequestError;
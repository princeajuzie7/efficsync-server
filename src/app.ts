import express, { Express, Request, Response,NextFunction } from "express";
import AuthRouter from "../routes/auth/AuthRoutes";
import Dbconnection from "../database/dbConnection";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "dotenv";

config()
const app: Express = express();
app.use(cors({ origin: "http://localhost:3000" , credentials: true, methods: ["GET,HEAD,PUT,PATCH,POST,DELETE"] }));
const Origins = ["http://localhost:3001", "http://localhost:3000"]
app.use(cookieParser(process.env.JWT_SECRET_KEY));
app.use(express.json());
app.use("/client/api/auth", AuthRouter);

const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}


// app.get("/", (req: Request, res: Response) => {
//   res.send({ htm: "Hello" });
// });

// app.use((error: Error, req:Request, res:Response, next:NextFunction )=>{
//  const statusCode = res.statusCode  || 500;
//  const errormsg = error.message || "Internal Server Error";
//  return res.status(statusCode).json({
//     success: false,
//     errormsg,
//     statusCode,
//  })

// })


Dbconnection(app);


export default app

import express, { Express, Request, Response,NextFunction } from "express";
import AuthRouter from "../routes/auth/AuthRoutes";
import Dbconnection from "../database/dbConnection";
import cors from "cors";

const app: Express = express();

const Origins = ["http://localhost:3001", "http://localhost:3000"]
app.use(express.json());
app.use("/client/api/auth", AuthRouter);
app.use(cors({ origin: Origins , credentials: true}));

// app.get("/", (req: Request, res: Response) => {
//   res.send({ htm: "Hello" });
// });

app.use((error: Error, req:Request, res:Response, next:NextFunction )=>{
 const statusCode = res.statusCode  || 500;
 const errormsg = error.message || "Internal Server Error";
 return res.status(statusCode).json({
    success: false,
    errormsg,
    statusCode,
 })

})

Dbconnection(app);


export default app

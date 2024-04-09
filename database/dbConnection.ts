import mongoose from "mongoose";
require("dotenv").config();
interface Server {
  listen: (port: string | number, callback: () => void) => void;
}

const port = process.env.PORT || 7000;
async function Dbconnection(server: Server) {
  if (process.env.MONGO_URL) {
    try {
      await mongoose.connect(process.env.MONGO_URL);

      server.listen(port, function () {
        console.log(`db is connected & server is listening on ${port}🔥`);
      });
 
    } catch (error: Error | any) {
      console.error(`Mongo URL Error: ${error}`);
    }
  }
}

export default Dbconnection;

import crypto from "crypto"


const createHash = (string: string) =>
  crypto.createHash("md5").update(string).digest("hex");


export default createHash;
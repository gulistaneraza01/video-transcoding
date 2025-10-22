import dot from "dotenv";
dot.config();

const region = process.env.REGION;
const accessKeyId = process.env.ACCESSKEYID;
const secretAccessKey = process.env.SECRETACCESSKEY;
const bucket = process.env.BUCKET;

export { region, accessKeyId, secretAccessKey, bucket };

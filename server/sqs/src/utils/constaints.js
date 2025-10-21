import dot from "dotenv";
dot.config();

const region = process.env.REGION;
const accessKeyId = process.env.ACCESSKEYID;
const secretAccessKey = process.env.SECRETACCESSKEY;
const queueUrl = process.env.QUEUEURL;

export { region, accessKeyId, secretAccessKey, queueUrl };

import { S3Client } from "@aws-sdk/client-s3";
import { accessKeyId, region, secretAccessKey } from "../utils/constaints.js";

const s3Client = new S3Client({
  region: region,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
});

export default s3Client;

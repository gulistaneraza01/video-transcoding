import { SQS } from "@aws-sdk/client-sqs";
import { accessKeyId, region, secretAccessKey } from "../utils/constaints.js";

const sqsClient = new SQS({
  region: region,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
});

export default sqsClient;

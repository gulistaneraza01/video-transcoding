import { accessKeyId, region, secretAccessKey } from "../utils/constaints.js";
import { ECSClient } from "@aws-sdk/client-ecs";

const ecsClient = new ECSClient({
  region: region,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
});

export default ecsClient;

import {
  DeleteMessageCommand,
  ReceiveMessageCommand,
} from "@aws-sdk/client-sqs";
import sqsClient from "./src/config/sqsClient.js";
import { queueUrl } from "./src/utils/constaints.js";
import runEcsTask from "./src/utils/ecsTaskRun.js";

async function init() {
  try {
    const command = new ReceiveMessageCommand({
      QueueUrl: queueUrl,
      MaxNumberOfMessages: 1,
      WaitTimeSeconds: 5,
    });

    while (true) {
      const { Messages } = await sqsClient.send(command);

      if (!Messages) {
        console.log("no message in queue");
        continue;
      }

      for (let message of Messages) {
        const fileData = JSON.parse(message.Body);
        const key = decodeURIComponent(
          fileData.Records[0].s3.object.key.replace(/\+/g, " ")
        );

        // constainer ecs
        runEcsTask(key);

        //delete object from queue
        const command = new DeleteMessageCommand({
          QueueUrl: queueUrl,
          ReceiptHandle: message.ReceiptHandle,
        });
        await sqsClient.send(command);
        console.log("container strated building✅");
      }
    }
  } catch (error) {
    console.log(error.message);
  }
}

init();

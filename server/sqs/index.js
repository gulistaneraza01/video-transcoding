import { ReceiveMessageCommand } from "@aws-sdk/client-sqs";
import sqsClient from "./src/config/sqsClient.js";
import { queueUrl } from "./src/utils/constaints.js";

console.log("hello");
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
        console.log(fileData);
      }
    }
  } catch (error) {
    console.log(error.message);
  }
}

init();

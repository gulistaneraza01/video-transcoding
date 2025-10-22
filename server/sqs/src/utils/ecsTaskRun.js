import { RunTaskCommand } from "@aws-sdk/client-ecs";
import ecsClient from "../config/ecsClient.js";

async function runEcsTask(key) {
  try {
    const command = new RunTaskCommand({
      cluster: process.env.ECS_CLUSTER,
      taskDefinition: process.env.ECS_TASKDEFINITION,
      launchType: "FARGATE",
      count: 1,
      networkConfiguration: {
        awsvpcConfiguration: {
          assignPublicIp: "ENABLED",
          subnets: [
            process.env.ECS_SUBNET_1,
            process.env.ECS_SUBNET_2,
            process.env.ECS_SUBNET_3,
          ],
          securityGroups: [process.env.ECS_SECURITYGRP],
        },
      },
      overrides: {
        containerOverrides: [
          {
            name: "transcode-image",
            environment: [
              { name: "REGION", value: process.env.REGION },
              { name: "ACCESSKEYID", value: process.env.ACCESSKEYID },
              { name: "SECRETACCESSKEY", value: process.env.SECRETACCESSKEY },
              { name: "VIDEO_KEY", value: key },
              { name: "BUCKET", value: process.env.BUCKET },
              { name: "OUTPUT_BUCKET", value: process.env.OUTPUT_BUCKET },
            ],
          },
        ],
      },
    });
    const response = await ecsClient.send(command);
    console.log("Container Spinup ✅");
  } catch (error) {
    console.error("Error running ECS task:", error);
    throw error;
  }
}

export default runEcsTask;

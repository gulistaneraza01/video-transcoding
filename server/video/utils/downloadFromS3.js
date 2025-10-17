import { GetObjectCommand } from "@aws-sdk/client-s3";
import s3Client from "../config/s3Client.js";
import fs from "node:fs";
import { pipeline } from "node:stream/promises";

async function downloadFromS3(bucket, key, outputDirPath) {
  try {
    console.log("Download started from s3✅");

    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    const videoRes = await s3Client.send(command);

    const fileStream = fs.createWriteStream(`${outputDirPath}/output.mp4`);
    await pipeline(videoRes.Body, fileStream);

    console.log("Download completed from s3✅");
  } catch (error) {
    console.log("❌", error.message);
  }
}

export default downloadFromS3;

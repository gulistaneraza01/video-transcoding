import { PutObjectCommand } from "@aws-sdk/client-s3";
import { readdir, readFile, stat } from "node:fs/promises";
import s3Client from "../config/s3Client.js";
import mime from "mime-types";
import path from "node:path";
import { nanoid } from "nanoid";
import fs from "node:fs";

async function uploadToS3(hslPath) {
  try {
    const hslDir = await readdir(hslPath, {
      recursive: true,
    });

    const id = nanoid(4).toLowerCase();

    for (let key of hslDir) {
      const filePath = path.join(hslPath, key);

      const stats = await stat(filePath);
      if (stats.isDirectory()) {
        continue;
      }

      const fileContent = await readFile(filePath);

      const command = new PutObjectCommand({
        Bucket: process.env.OUTPUT_BUCKET,
        Key: `${id}/${key}`,
        Body: fileContent,
        ContentType: mime.lookup(key) || "application/octet-stream",
      });

      await s3Client.send(command);
      console.log("uploading...");
    }
    console.log("✅completed upload to s3");
  } catch (error) {
    console.log("❌", error.message);
  }
}

export default uploadToS3;

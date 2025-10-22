import transcode from "./utils/transcode.js";
import downloadFromS3 from "./utils/downloadFromS3.js";
import dotenv from "dotenv";
import masterPlaylist from "./utils/masterPlaylist.js";
import path from "node:path";
import { fileURLToPath } from "node:url";
import uploadToS3 from "./utils/uploadToS3.js";
import deleteVideoFromS3 from "./utils/deleteVideoFromS3.js";
dotenv.config();

const videoKey = process.env.VIDEO_KEY;
const bucket = process.env.BUCKET;

console.log(videoKey);
async function init() {
  console.log("container started✅");

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const outputDirPath = path.join(__dirname, "output");
  const hslPath = path.join(__dirname, "output", "hsl");
  const videoPath = path.join(__dirname, "output", "output.mp4");

  // download Video from
  await downloadFromS3(bucket, videoKey, outputDirPath);

  //video transcode
  await transcode(videoPath, hslPath);
  await masterPlaylist(hslPath);

  //uplaod hsl video to S3
  await uploadToS3(hslPath);

  //Delete video from S3
  await deleteVideoFromS3(bucket, videoKey);

  console.log("container exit ✅");
}

init();

import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import s3Client from "../config/s3Client.js";

async function deleteVideoFromS3(bucket, videoKey) {
  try {
    const command = new DeleteObjectCommand({ Bucket: bucket, Key: videoKey });
    await s3Client.send(command);
    console.log("✅Successfully delete from S3 Video");
  } catch (error) {
    console.log("❌Failed To Delete S3 Video From Temp", error.message);
  }
}

export default deleteVideoFromS3;

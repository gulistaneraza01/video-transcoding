import { PutObjectCommand } from "@aws-sdk/client-s3";
import TryCatch from "../utils/TryCatch.js";
import { bucket } from "../utils/constaints.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3Client from "../config/s3Client.js";
import { nanoid } from "nanoid";

export const presignedUrl = TryCatch(async (req, res) => {
  const { fileName } = req.body;
  const userId = nanoid(4);

  const command = new PutObjectCommand({
    Key: `${userId}/${fileName}`,
    Bucket: bucket,
    ContentType: "video/mp4",
  });

  const presigned = await getSignedUrl(s3Client, command, {
    expiresIn: 3600,
  });

  res.json({ presignedURL: presigned });
});

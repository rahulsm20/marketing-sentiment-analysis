import { config } from "@/config";
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { Readable } from "node:stream";

export const s3Client = new S3Client({
  region: config.AWS_REGION,
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  },
});

export const uploadFileToS3 = async (
  filePath: string,
  fileName: string,
): Promise<Boolean> => {
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: fileName,
    Body: Readable.from(filePath),
  });
  await s3Client.send(command);
  return true;
};

export const getFileFromS3 = async (fileName: string): Promise<Buffer> => {
  const command = new GetObjectCommand({
    Bucket: config.S3_BUCKET,
    Key: fileName,
  });
  const response = await s3Client.send(command);
  return response.Body as unknown as Buffer;
};

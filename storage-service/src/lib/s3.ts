import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { config } from "../utils/config";

class S3ClientClass extends S3Client {
  private bucketName: string;
  constructor(bucketName?: string) {
    super({
      region: config.AWS_REGION,
      credentials: {
        accessKeyId: config.AWS_ACCESS_KEY_ID,
        secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
      },
    });
    this.bucketName = bucketName || config.S3_BUCKET_NAME;
  }

  uploadToS3 = async (
    key: string,
    body: Buffer | Uint8Array | Blob | string
  ) => {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: body,
    });
    await this.send(command);
    console.log(`File uploaded successfully to ${this.bucketName}/${key}`);
    return true;
  };

  getFileFromS3 = async ({
    bucketName = this.bucketName,
    key,
    expiresInSeconds = 3600,
  }: {
    bucketName?: string;
    key: string;
    expiresInSeconds?: number;
  }) => {
    if (!key) {
      throw new Error("Key is required to get file from S3");
    }
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });
    const signedUrl = await getSignedUrl(this, command, {
      expiresIn: expiresInSeconds,
    });
    return signedUrl;
  };
}

export const s3Client = new S3ClientClass();

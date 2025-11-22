import { s3Client } from "@/lib/s3";
import { getKey, setKey } from "@/utils/redis";
import { Request, Response } from "express";

/**
 * Controller to handle file upload and download using S3ClientClass
 */
export const fileController = {
  async uploadFile(req: Request, res: Response) {
    const { file } = req.body;
    if (!file) {
      return res.status(400).json({ message: "No file provided" });
    }
    try {
      const cachedData = await getKey(file.name);
      if (cachedData) {
        return res
          .status(200)
          .json({ message: "File retrieved from cache", data: cachedData });
      }
      const data = await s3Client.uploadToS3(file.name, file.data);
      await setKey(file.name, file.data, 3600);
      return res
        .status(200)
        .json({ message: "File uploaded successfully", data });
    } catch (error) {
      return res.status(500).json({ message: "Error uploading file", error });
    }
  },
  async downloadFile(req: Request, res: Response) {
    const { fileName } = req.params;
    try {
      const cachedData = await getKey(fileName);
      if (cachedData) {
        return res
          .status(200)
          .json({ message: "File retrieved from cache", data: cachedData });
      }
      const fileData = await s3Client.getFileFromS3({ key: fileName });
      await setKey(fileName, fileData, 3600);
      return res
        .status(200)
        .json({ message: "File downloaded successfully", fileData });
    } catch (error) {
      return res.status(500).json({
        error:
          error instanceof Error ? error.message : "Error downloading file",
      });
    }
  },
};

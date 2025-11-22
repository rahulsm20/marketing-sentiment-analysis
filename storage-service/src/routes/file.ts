import { fileController } from "@/controllers/file";
import express from "express";

const router = express.Router();

router.get("/:filename", fileController.downloadFile);
router.post("/", fileController.uploadFile);

export { router as fileRouter };

import express from "express";
import { presignedUrl } from "../controllers/client.js";

const router = express.Router();

router.post("/presignedurl", presignedUrl);

export default router;

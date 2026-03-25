import multer from "multer";
import { MAX_FILE_SIZE } from "../constants/assets.constants.js";

const storage = multer.memoryStorage();

export const upload = multer({
    storage,
    limits: {
        fileSize: MAX_FILE_SIZE
    }
});
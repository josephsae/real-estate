import multer from "multer";
import path from "path";
import { generateId } from "../helpers/tokens.js";

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./public/uploads/")
    },
    filename: (requ, file, callback) => {
        callback(null, generateId() + path.extname(file.originalname))
    }
});

const upload = multer({ storage });

export default upload;
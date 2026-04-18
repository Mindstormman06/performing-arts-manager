import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) {
	fs.mkdirSync(uploadsDir, { recursive: true });
}

// Set up storage
const storage = multer.diskStorage({
	destination: (req, _file, cb) => {
		const subDir = req.uploadSubDir || "";
		const targetDir = path.join(uploadsDir, subDir);

		// eslint-disable-next-line security/detect-non-literal-fs-filename
		if (!fs.existsSync(targetDir)) {
			// eslint-disable-next-line security/detect-non-literal-fs-filename
			fs.mkdirSync(targetDir, { recursive: true });
		}
		cb(null, targetDir);
	},
	filename: (req, file, cb) => {
		// Create unique filename: timestamp-userid-originalname
		const uniqueSuffix = `${Date.now()}-${req.user?.id || "unknown"}`;
		const ext = path.extname(file.originalname);
		const name = path.basename(file.originalname, ext);
		cb(null, `${name}-${uniqueSuffix}${ext}`);
	},
});

// File filter - only accept images
const fileFilter = (_req, file, cb) => {
	const allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
	if (allowedMimes.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(new Error("Only image files are allowed (JPEG, PNG, WebP, GIF)"), false);
	}
};

// Configure multer
const upload = multer({
	storage,
	fileFilter,
	limits: {
		fileSize: 5 * 1024 * 1024, // 5MB
	},
});

export const setUploadSubDir = (dir) => (req, _res, next) => {
	req.uploadSubDir = dir;
	next();
};

export default upload;

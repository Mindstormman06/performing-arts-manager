/**
 * Multer setup for image uploads saved to local disk.
 *
 * @remarks
 * Creates `server/uploads` on import. Exports the configured `upload` instance
 * (default), `MIME_EXTENSIONS`, and `setUploadSubDir(dir)`, which must run
 * before `upload` to save into `uploads/<dir>` (created on demand). Accepts
 * only JPEG, PNG, WebP and GIF files up to 5 MB, named from the sanitized
 * original name, a timestamp and `req.user.id`.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) {
	fs.mkdirSync(uploadsDir, { recursive: true });
}

export const MIME_EXTENSIONS = {
	"image/jpeg": ".jpg",
	"image/png": ".png",
	"image/webp": ".webp",
	"image/gif": ".gif",
};

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
		// The extension always comes from the (allow-listed) MIME type, never the
		// client's filename, so an upload can't be served back as HTML/JS.
		const uniqueSuffix = `${Date.now()}-${req.user?.id || "unknown"}`;
		const ext = MIME_EXTENSIONS[file.mimetype];
		const name =
			path
				.basename(file.originalname, path.extname(file.originalname))
				.replace(/[^a-zA-Z0-9_-]/g, "_")
				.slice(0, 60) || "upload";
		cb(null, `${name}-${uniqueSuffix}${ext}`);
	},
});

const fileFilter = (_req, file, cb) => {
	if (Object.hasOwn(MIME_EXTENSIONS, file.mimetype)) {
		cb(null, true);
	} else {
		cb(new Error("Only image files are allowed (JPEG, PNG, WebP, GIF)"), false);
	}
};

const upload = multer({
	storage,
	fileFilter,
	limits: {
		fileSize: 5 * 1024 * 1024,
	},
});

export const setUploadSubDir = (dir) => (req, _res, next) => {
	req.uploadSubDir = dir;
	next();
};

export default upload;

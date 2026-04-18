import fs from "node:fs";
import path from "node:path";

import { afterAll, describe, expect, it, vi } from "vitest";

import upload, { setUploadSubDir } from "../../src/config/multer.config.js";

const testSubDir = "unit-test-multer";
const uploadsPath = path.resolve(process.cwd(), "uploads", testSubDir);

describe("Multer Config", () => {
	afterAll(() => {
		if (fs.existsSync(uploadsPath)) {
			fs.rmSync(uploadsPath, { recursive: true, force: true });
		}
	});

	it("accepts allowed image MIME types", () => {
		const cb = vi.fn();
		upload.fileFilter({}, { mimetype: "image/png" }, cb);

		expect(cb).toHaveBeenCalledWith(null, true);
	});

	it("rejects non-image MIME types", () => {
		const cb = vi.fn();
		upload.fileFilter({}, { mimetype: "application/pdf" }, cb);

		expect(cb.mock.calls[0][0]).toBeInstanceOf(Error);
		expect(cb.mock.calls[0][1]).toBe(false);
	});

	it("builds file names with user id when available", () => {
		const cb = vi.fn();
		upload.storage.getFilename(
			{ user: { id: 42 } },
			{ originalname: "headshot.jpg" },
			cb,
		);

		expect(cb).toHaveBeenCalled();
		const createdName = cb.mock.calls[0][1];
		expect(createdName).toMatch(/^headshot-\d+-42\.jpg$/);
	});

	it("uses unknown user id when request user is missing", () => {
		const cb = vi.fn();
		upload.storage.getFilename({}, { originalname: "profile.webp" }, cb);

		expect(cb.mock.calls[0][1]).toMatch(/^profile-\d+-unknown\.webp$/);
	});

	it("creates destination directory for request subfolder", () => {
		const cb = vi.fn();
		upload.storage.getDestination({ uploadSubDir: testSubDir }, {}, cb);

		expect(cb).toHaveBeenCalledWith(null, expect.stringContaining(testSubDir));
		expect(fs.existsSync(uploadsPath)).toBe(true);
	});

	it("reuses existing destination directory", () => {
		const cb = vi.fn();
		upload.storage.getDestination({ uploadSubDir: testSubDir }, {}, cb);

		expect(cb).toHaveBeenCalledWith(null, expect.stringContaining(testSubDir));
	});

	it("setUploadSubDir middleware stores subfolder and calls next", () => {
		const req = {};
		const next = vi.fn();

		setUploadSubDir("profiles")(req, {}, next);

		expect(req.uploadSubDir).toBe("profiles");
		expect(next).toHaveBeenCalled();
	});
});

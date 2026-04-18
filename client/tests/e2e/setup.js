import { execSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function globalSetup() {
	console.log("🚀 Starting Global Setup: Seeding Database...");
	try {
		const serverPath = resolve(__dirname, "../../../server");
		execSync("node seed.js", {
			cwd: serverPath,
			stdio: "inherit",
			// eslint-disable-next-line no-undef
			env: { ...process.env, NODE_ENV: "test" },
		});
		console.log("✅ Global Setup Complete: Database is ready.");
	} catch (error) {
		console.error("❌ Global Setup Failed:", error);
		// eslint-disable-next-line no-undef
		process.exit(1);
	}
}

export default globalSetup;

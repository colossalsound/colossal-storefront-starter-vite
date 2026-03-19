import fs from "node:fs";
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

function puckDevServer(): Plugin {
	const dataDir = path.resolve("puck-data");
	return {
		name: "puck-dev-server",
		apply: "serve",
		configureServer(server) {
			// Serve puck-data JSON files
			server.middlewares.use("/puck-data", (req, res, next) => {
				if (req.method !== "GET") return next();
				const filePath = path.join(dataDir, req.url || "");
				if (fs.existsSync(filePath)) {
					res.writeHead(200, { "Content-Type": "application/json" });
					res.end(fs.readFileSync(filePath, "utf-8"));
				} else {
					res.statusCode = 404;
					res.end("");
				}
			});

			// Save endpoint
			server.middlewares.use("/__puck_save", (req, res) => {
				if (req.method !== "POST") {
					res.statusCode = 405;
					res.end();
					return;
				}
				let body = "";
				req.on("data", (chunk: string) => {
					body += chunk;
				});
				req.on("end", () => {
					try {
						const { fileName, data } = JSON.parse(body);
						if (!fs.existsSync(dataDir)) {
							fs.mkdirSync(dataDir, { recursive: true });
						}
						fs.writeFileSync(
							path.join(dataDir, `${fileName}.json`),
							JSON.stringify(data, null, 2),
						);
						res.writeHead(200, { "Content-Type": "application/json" });
						res.end(JSON.stringify({ status: "ok" }));
					} catch {
						res.statusCode = 400;
						res.end(JSON.stringify({ error: "Invalid request" }));
					}
				});
			});
		},
	};
}

function copyPuckData(): Plugin {
	const dataDir = path.resolve("puck-data");
	return {
		name: "copy-puck-data",
		apply: "build",
		closeBundle() {
			const outDir = path.resolve("dist", "puck-data");
			if (!fs.existsSync(dataDir)) return;
			fs.mkdirSync(outDir, { recursive: true });
			for (const file of fs.readdirSync(dataDir)) {
				if (file.endsWith(".json")) {
					fs.copyFileSync(path.join(dataDir, file), path.join(outDir, file));
				}
			}
		},
	};
}

export default defineConfig({
	plugins: [
		tsconfigPaths({ projects: ["./tsconfig.json"] }),
		tailwindcss(),
		tanstackRouter(),
		puckDevServer(),
		copyPuckData(),
		viteReact(),
	],
});

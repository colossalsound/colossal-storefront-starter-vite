import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import {
	editorAnnotatePlugin,
	editorVitePlugin,
} from "@colossal-sh/visual-editor/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	plugins: [
		editorAnnotatePlugin(),
		tsconfigPaths({ projects: ["./tsconfig.json"] }),
		tailwindcss(),
		tanstackRouter(),
		editorVitePlugin(),
		viteReact(),
	],
});

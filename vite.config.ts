import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import VueDevTools from "vite-plugin-vue-devtools";
import manifest from "./manifest.json" assert { type: "json" }; // Node >=17
import { crx } from "@crxjs/vite-plugin";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), crx({ manifest }), VueDevTools()],
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html")
            }
        },
        minify: false
    },
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url))
        }
    }
});

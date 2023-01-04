import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";

import vue from "@vitejs/plugin-vue";
import Icons from "unplugin-icons/vite";

export default defineConfig({
    plugins: [
        vue(),
        Icons({
            compiler: "vue3",
        }),
        laravel({
            input: ["resources/css/app.less", "resources/js/app.js"],
            refresh: true,
        }),
    ],
});

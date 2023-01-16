import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";

import vue from "@vitejs/plugin-vue";
import Icons from "unplugin-icons/vite";

export default defineConfig({
    plugins: [
        vue({
            template: {
                transformAssetUrls: {
                    includeAbsolute: false,
                },
            },
        }),
        Icons({
            compiler: "vue3",
        }),
        laravel({
            input: [
                "resources/css/app.less",
                "resources/js/app.js",
                "resources/js/dashboard.js",
                "resources/css/dashboard.less",
                "resources/js/builder.js",
                "resources/css/builder.less",
            ],
            refresh: true,
        }),
    ],
});

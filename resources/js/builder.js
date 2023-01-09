import { createApp } from "vue";
import { createPinia } from "pinia";
import { vfmPlugin } from "vue-final-modal";
import tooltip from "./directives/tooltip.js";

import App from "./App.vue";

import router from "./routes/appRouter";

import.meta.glob(["../images/**"]);

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(pinia);
app.use(vfmPlugin);

app.directive("tooltip", tooltip);

app.mount("#app");

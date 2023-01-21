import { createApp } from "vue";
import { createPinia } from "pinia";
import { vfmPlugin } from "vue-final-modal";
import tooltip from "./directives/tooltip.js";
import VSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import Toast, { POSITION } from "vue-toastification";

import App from "./App.vue";

import router from "./routes/appRouter";

import.meta.glob(["../images/**"]);

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(pinia);
app.use(vfmPlugin);

app.use(Toast, {
    position: POSITION.TOP_RIGHT,
    timeout: 3000,
});

app.directive("tooltip", tooltip);

app.component("VSelect", VSelect);

app.mount("#app");

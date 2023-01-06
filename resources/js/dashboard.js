import { createApp } from "vue";
import { createPinia } from "pinia";
import VSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import { vfmPlugin } from "vue-final-modal";

import App from "./App.vue";

import router from "./routes/dashboardRouter.js";

const app = createApp(App);
const pinia = createPinia();

app.component("VSelect", VSelect);
app.use(router);
app.use(pinia);
app.use(vfmPlugin);

app.mount("#app");

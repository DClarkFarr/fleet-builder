import { createApp } from "vue";
import { createPinia } from "pinia";
import { vfmPlugin } from "vue-final-modal";
import tooltip from "./directives/tooltip.js";
import App from "./App.vue";

import router from "./routes/builderRouter";
import useMustAuthState from "./hooks/useMustAuthState.js";

import.meta.glob(["../images/**"]);

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);

app.use(router);
app.use(vfmPlugin);

app.directive("tooltip", tooltip);

app.mount("#app");

useMustAuthState();

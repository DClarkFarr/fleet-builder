import { createApp } from "vue";
import { createPinia } from "pinia";
import VSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import { vfmPlugin } from "vue-final-modal";
import tooltip from "./directives/tooltip.js";
import Toast, { POSITION } from "vue-toastification";

import App from "./components/Tesseract/App.vue";

import useMustAuthState from "./hooks/useMustAuthState.js";

import.meta.glob(["../images/**"]);

const app = createApp(App);
const pinia = createPinia();

app.directive("tooltip", tooltip);

app.component("VSelect", VSelect);

app.use(pinia);
app.use(vfmPlugin);
app.use(Toast, {
    position: POSITION.TOP_RIGHT,
    timeout: 3000,
});

app.mount("#app");

useMustAuthState();

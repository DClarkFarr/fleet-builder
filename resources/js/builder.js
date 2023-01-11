import { createApp } from "vue";
import { createPinia } from "pinia";
import { vfmPlugin } from "vue-final-modal";
import tooltip from "./directives/tooltip.js";
import Toast, { POSITION } from "vue-toastification";
import VSelect from "vue-select";
import "vue-select/dist/vue-select.css";

import App from "./App.vue";
import router from "./routes/builderRouter";
import useMustAuthState from "./hooks/useMustAuthState.js";

import ConfirMModal from "./components/Themed/controls/ConfirmModal.vue";

import.meta.glob(["../images/**"]);

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);

app.component("VSelect", VSelect);
app.component("ConfirmModal", ConfirMModal);

app.use(router);
app.use(vfmPlugin);

app.directive("tooltip", tooltip);
app.use(Toast, {
    position: POSITION.TOP_RIGHT,
    timeout: 3000,
});

app.mount("#app");

useMustAuthState();

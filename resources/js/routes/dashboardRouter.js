import { createRouter, createWebHistory } from "vue-router";

import Dashboard from "../pages/dashboard/Dashboard.vue";

const routes = [{ path: "/", component: Dashboard, name: "dashboard" }];

// keep it simple for now.
const router = createRouter({
    history: createWebHistory("/dashboard"),
    routes, // short for `routes: routes`
});

export default router;

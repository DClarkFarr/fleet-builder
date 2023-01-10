import { createRouter, createWebHistory } from "vue-router";

import Home from "../pages/builder/MyFleets.vue";

const routes = [{ path: "/", component: Home, name: "builder.fleets" }];

// keep it simple for now.
const router = createRouter({
    history: createWebHistory("/builder"),
    routes, // short for `routes: routes`
});

export default router;

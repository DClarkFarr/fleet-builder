import { createRouter, createWebHistory } from "vue-router";

import Home from "../pages/builder/MyFleets.vue";
import Workshop from "../pages/builder/Workshop.vue";
import Viewer from "../pages/builder/Viewer.vue";

const routes = [
    {
        path: "/",
        component: Home,
        name: "builder.fleets",
    },
    {
        path: "/viewer",
        component: Viewer,
        name: "builder.viewer",
    },
    {
        path: "/workshop/:id_workshop",
        component: Workshop,
        name: "builder.workshop",
    },
];

// keep it simple for now.
const router = createRouter({
    history: createWebHistory("/builder"),
    routes, // short for `routes: routes`
});

export default router;

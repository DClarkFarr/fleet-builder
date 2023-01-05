import { createRouter, createWebHistory } from "vue-router";

import Ships from "../pages/dashboard/Ships.vue";
import Classes from "../pages/dashboard/ShipClasses.vue";
import Levels from "../pages/dashboard/ShipLevels.vue";
import Users from "../pages/dashboard/Users.vue";

const routes = [
    { path: "/", component: Ships, name: "dashboard.ships" },
    { path: "/classes", component: Classes, name: "dashboard.classes" },
    { path: "/levels", component: Levels, name: "dashboard.levels" },
    { path: "/users", component: Users, name: "dashboard.users" },
];

// keep it simple for now.
const router = createRouter({
    history: createWebHistory("/dashboard"),
    routes, // short for `routes: routes`
});

export default router;

import { createRouter, createWebHistory } from "vue-router";

import Ships from "../pages/dashboard/Ships.vue";
import Classes from "../pages/dashboard/ShipClasses.vue";
import Levels from "../pages/dashboard/ShipLevels.vue";
import Users from "../pages/dashboard/Users.vue";
import CreateShip from "../pages/dashboard/Ships/CreateShip.vue";
import EditShip from "../pages/dashboard/Ships/EditShip.vue";

import Admirals from "../pages/dashboard/Admirals.vue";
import CreateAdmiral from "../pages/dashboard/Admirals/CreateAdmiral.vue";
import EditAdmiral from "../pages/dashboard/Admirals/EditAdmiral.vue";

const routes = [
    { path: "/ships", component: Ships, name: "dashboard.ships" },
    {
        path: "/ships/add",
        component: CreateShip,
        name: "dashboard.ships.create",
    },
    { path: "/ships/:id", component: EditShip, name: "dashboard.ships.edit" },

    { path: "/admirals", component: Admirals, name: "dashboard.admirals" },
    {
        path: "/admirals/add",
        component: CreateAdmiral,
        name: "dashboard.admirals.create",
    },
    {
        path: "/admirals/:id",
        component: EditAdmiral,
        name: "dashboard.admirals.edit",
    },

    { path: "/classes", component: Classes, name: "dashboard.classes" },
    { path: "/levels", component: Levels, name: "dashboard.levels" },
    { path: "/users", component: Users, name: "dashboard.users" },
    {
        path: "/",
        redirect: { name: "dashboard.ships" },
    },
];

// keep it simple for now.
const router = createRouter({
    history: createWebHistory("/dashboard"),
    routes, // short for `routes: routes`
});

export default router;

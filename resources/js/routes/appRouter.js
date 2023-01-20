import { createRouter, createWebHistory } from "vue-router";

import Home from "../pages/Home.vue";
import Login from "../pages/Login.vue";
import Signup from "../pages/Signup.vue";
import ShareWorkshop from "../pages/ShareWorkshop.vue";

const routes = [
    {
        path: "/share/:id_workshop",
        component: ShareWorkshop,
        name: "share.workshop",
    },
    { path: "/login", component: Login, name: "login" },
    { path: "/signup", component: Signup, name: "signup" },
    { path: "/", component: Home, name: "home" },
];

// keep it simple for now.
const router = createRouter({
    history: createWebHistory(),
    routes, // short for `routes: routes`
});

export default router;

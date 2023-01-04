import { createRouter, createWebHistory } from "vue-router";

import Home from "../pages/Home.vue";
import Login from "../pages/Login.vue";
import Signup from "../pages/Signup.vue";

const routes = [
    { path: "/login", component: Login, name: "user.login" },
    { path: "/signup", component: Signup, name: "user.signup" },
    { path: "/", component: Home },
];

// keep it simple for now.
const router = createRouter({
    history: createWebHistory(),
    routes, // short for `routes: routes`
});

export default router;

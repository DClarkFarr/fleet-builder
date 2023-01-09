<script setup>
import UserLayout from "../../components/layouts/UserLayout.vue";

import useUserStore from "../../stores/userStore";

const userStore = useUserStore();

const onClick = () => {
    console.log("clicked!");
    userStore.logout();
};
</script>
<template>
    <UserLayout>
        <h1>Home</h1>
        <button class="btn bg-sky-600" @click="onClick">Click me</button>
    </UserLayout>
</template>

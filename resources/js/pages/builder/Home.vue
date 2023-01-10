<script setup>
import BuilderLayout from "../../components/layouts/BuilderLayout.vue";
import useUserStore from "../../stores/userStore";

const userStore = useUserStore();
</script>
<template>
    <BuilderLayout>
        <h1>You are my hero</h1>
    </BuilderLayout>
</template>

<script setup>
import { onMounted } from "vue";
import useUserStore from "../../stores/userStore";

const userStore = useUserStore();

onMounted(() => {
    if (!userStore.user) {
        userStore.refresh();
    }
});
</script>

<template>
    <div class="layout layout--user">
        <slot></slot>
    </div>
</template>

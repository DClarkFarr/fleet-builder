<script setup>
import useUserStore from "../../stores/userStore";

const userStore = useUserStore();

// userStore.refreshUser();
</script>

<template>
    <div class="layout layout--user">
        <slot></slot>
    </div>
</template>

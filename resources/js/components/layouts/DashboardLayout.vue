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
    <div class="layout layout--dashboard">
        <template v-if="userStore.isAdmin">
            <slot></slot>
        </template>
        <template v-else>
            <div
                class="lock h-full w-full flex items-center justify-center bg-gray-200 p-8"
            >
                <div>
                    <h1 class="text-xl mb-4">Dashboard Page</h1>
                    <h3 class="text-lg">Admin permissions required to view</h3>
                </div>
            </div>
        </template>
    </div>
</template>

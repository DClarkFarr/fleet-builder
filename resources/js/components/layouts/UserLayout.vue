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
        <template v-if="userStore.isAdmin">
            <div
                class="bg-indigo-900 text-indigo-200 px-3 py-1 md:flex gap-x-2"
            >
                <div class="">
                    Welcome, {{ userStore.user.name }}. Hail, o' great admin!
                </div>
                <div class="ml-auto">
                    <a
                        href="/dashboard"
                        class="text-indigo-100 hover:text-white"
                    >
                        Admin panel
                    </a>
                </div>
            </div>
        </template>
        <slot></slot>
    </div>
</template>

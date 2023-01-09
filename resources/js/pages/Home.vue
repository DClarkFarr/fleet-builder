<script setup>
import UserLayout from "../components/layouts/UserLayout.vue";
import useUserStore from "../stores/userStore";

const userStore = useUserStore();

const onClick = () => {
    console.log("clicked!");
    userStore.logout();
};
</script>
<template>
    <UserLayout>
        <div class="view view space-bg">
            <div class="banner">
                <img src="/images/banner-2.jpg" alt="banner" />
            </div>
        </div>
    </UserLayout>
</template>

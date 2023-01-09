<script setup>
import UserLayout from "../components/layouts/UserLayout.vue";
import ContentBox from "../components/Themed/ContentBox.vue";
</script>

<template>
    <UserLayout class="themed">
        <div class="view view space-bg">
            <div class="banner relative">
                <img src="/images/banner-2.jpg" alt="banner" />
                <div class="banner__logo absolute max-w-full w-[300px]">
                    <img src="/images/big-logo.png" alt="logo" />
                </div>
            </div>

            <ContentBox>
                <h1>Happy happy</h1>
                <h1>Happy birthday</h1>
                <h1>Happy we all belong to you</h1>
            </ContentBox>
        </div>
    </UserLayout>
</template>

<style lang="less">
.banner {
    &__logo {
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        img {
            filter: brightness(1.5);
            background: rgba(0, 0, 0, 0.5);
            box-shadow: 0 0 33px 0px rgb(0, 0, 0, 0.5);
        }
    }
}
</style>

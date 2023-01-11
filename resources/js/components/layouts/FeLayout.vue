<script setup>
import UserLayout from "./UserLayout.vue";
import ContentBox from "../../components/Themed/ContentBox.vue";
import useUserStore from "../../stores/userStore";

const userStore = useUserStore();

const onClickLogout = () => {
    userStore.logout();
};
</script>

<template>
    <UserLayout class="themed">
        <div class="view view space-bg">
            <div class="banner relative mb-10 max-w-[1920px] mx-auto">
                <img src="/images/banner-2.jpg" alt="banner" class="mx-auto" />

                <div class="banner__logo absolute max-w-full w-[300px]">
                    <router-link :to="{ name: 'home' }">
                        <img src="/images/big-logo.png" alt="logo" />
                    </router-link>
                </div>
                <div class="banner__top">
                    <slot name="bannerTop">
                        <div
                            class="flex justify-end gap-x-4 items-center w-full p-2"
                        >
                            <template v-if="userStore.user">
                                <a href="/builder" class="banner__link">
                                    My Fleets
                                </a>
                                <router-link
                                    :to="{ name: 'login' }"
                                    class="banner__link"
                                    @click="onClickLogout"
                                >
                                    Logout
                                </router-link>
                            </template>
                            <template v-else>
                                <router-link
                                    :to="{ name: 'login' }"
                                    class="banner__link"
                                >
                                    Login
                                </router-link>
                            </template>
                        </div>
                    </slot>
                </div>
            </div>

            <ContentBox class="max-w-xl mx-auto">
                <slot></slot>
            </ContentBox>
        </div>
    </UserLayout>
</template>

<style lang="less">
.banner {
    &__link {
        @apply text-grow-green-text-alt;

        text-shadow: 0 0 10px #05774e;
    }

    &__logo {
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1;
        img {
            filter: brightness(1.5);
            background: rgba(0, 0, 0, 0.5);
            box-shadow: 0 0 33px 0px rgb(0, 0, 0, 0.5);
        }
    }

    &__top {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
    }
}
</style>

<script setup>
import { useRouter } from "vue-router";
import FeLayout from "../components/layouts/FeLayout.vue";
import useUserStore from "../stores/userStore";

const userStore = useUserStore();
const router = useRouter();

const onClickGetStarted = () => {
    if (userStore.user) {
        window.location.href = "/builder";
    } else {
        router.push({ name: "signup" });
    }
};
</script>

<template>
    <FeLayout>
        <div class="p-4">
            <h1 class="text-4xl font-medium text-text-blue mb-2">
                Welcome, fleet builder!
            </h1>
            <p class="text-lg text-white/75 mb-8">
                What to do here, is as easy as 1, 2, 3!
            </p>

            <ul
                class="steps list-unstyled ml-6 mr-3 flex flex-col gap-y-4 mb-10"
            >
                <li class="steps__li">
                    <div class="steps__number text-text-blue text-2xl">1.</div>
                    <div class="steps__text text-white/75">
                        Select which ships you have in your fleet, their chip
                        level, etc.
                    </div>
                </li>
                <li class="steps__li">
                    <div class="steps__number text-text-blue text-2xl">2.</div>
                    <div class="steps__text text-white/75">
                        Build as many fleets as you want, compare bonus stats
                        and unlock the most effective combinations for you!
                    </div>
                </li>
                <li class="steps__li">
                    <div class="steps__number text-text-blue text-2xl">3.</div>
                    <div class="steps__text text-white/75">
                        Share with your friends, so they can see how awesome you
                        are!
                    </div>
                </li>
            </ul>

            <div class="w-full">
                <button
                    @click="onClickGetStarted"
                    class="btn block btn-blue w-full"
                >
                    Get started
                </button>
            </div>
        </div>
    </FeLayout>
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

.steps {
    &__li {
        @apply flex items-start gap-x-2;
    }
    &__text {
        min-height: 30px;
    }
}
</style>

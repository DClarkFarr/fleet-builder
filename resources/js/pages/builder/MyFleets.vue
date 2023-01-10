<script setup>
import { onBeforeMount } from "vue";

import BuilderLayout from "../../components/layouts/BuilderLayout.vue";
import useUserStore from "../../stores/userStore";

const userStore = useUserStore();

const showShipsModal = () => {};

onBeforeMount(() => {
    userStore.loadShips();
});
</script>
<template>
    <BuilderLayout>
        <div class="my-fleets flex w-full justify-center items-center">
            <div
                class="my-fleets__content w-full max-w-4xl p-6 text-modal-text"
            >
                <div class="lg:flex w-full items-stretch gap-x-6">
                    <div class="my-fleets__fleets h-full lg:w-1/2">
                        <div class="flex items-end w-full mb-2">
                            <div>
                                <div
                                    class="title text-2xl text-modal-title font-medium leading-none"
                                >
                                    My Ships
                                </div>
                            </div>
                            <div class="ml-auto">
                                <button
                                    class="btn btn-blue btn-sm ml-4"
                                    @click="showShipsModal"
                                >
                                    Add Ship
                                </button>
                            </div>
                        </div>
                        <div class="bordered p-6"></div>
                    </div>
                    <div class="my-fleets__workshops h-full lg:w-1/2">
                        <div
                            class="title text-2xl text-modal-title font-medium"
                        >
                            My Workshops
                        </div>
                        <div class="bordered p-6"></div>
                    </div>
                </div>
            </div>
        </div>
    </BuilderLayout>
</template>

<style lang="less">
.my-fleets {
    min-height: 100vh;

    .has-admin-bar & {
        min-height: calc(100vh - 32px);
    }
}
</style>

<style lang="less" scoped>
.bordered {
    border: solid 1px #4578a5;
    border-radius: 4px;
    box-shadow: inset 0 0 2px 0px #517090;
    background: fade(#697381, 25%);
}
</style>

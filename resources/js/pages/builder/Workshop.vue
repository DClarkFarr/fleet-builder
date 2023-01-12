<script setup>
import { onBeforeMount, ref } from "vue";
import { $vfm } from "vue-final-modal";

import BuilderLayout from "../../components/layouts/BuilderLayout.vue";
import useBuilderStore from "../../stores/builderStore";

import LockIcon from "~icons/fa-solid/unlock-alt";

const builderStore = useBuilderStore();

const allLoaded = ref(false);

onBeforeMount(() => {
    const def1 = builderStore.ships.length
        ? Promise.resolve()
        : builderStore.loadShips();
    const def2 = builderStore.userShips.length
        ? Promise.resolve()
        : builderStore.loadUserShips();
    const def3 = builderStore.shipClasses.length
        ? Promise.resolve()
        : builderStore.loadShipClasses();
    const def4 = builderStore.workshops.length
        ? Promise.resolve()
        : builderStore.loadWorkshops();

    Promise.all([def1, def2, def3, def4]).then(() => {
        allLoaded.value = true;
    });
});
</script>
<template>
    <BuilderLayout>
        <div class="workshop flex w-full justify-center items-center">
            <div class="workshop__content w-full max-w-6xl p-6 text-modal-text">
                <div class="grid gap-4">
                    <div class="fleet-slot fleet-slot--empty">
                        <div class="fleet-slot__info"></div>
                        <div
                            class="fleet-slot__bottom flex flex-col items-center"
                        >
                            <div class="fleet-slot__button">
                                <LockIcon />
                            </div>
                            <div class="sleet-slot__label text-xs text-white">
                                Fleet 1
                            </div>
                        </div>
                    </div>

                    <div class="fleet-slot fleet-slot--busy">
                        <div class="fleet-slot__info"></div>
                        <div
                            class="fleet-slot__bottom flex flex-col items-center"
                        >
                            <div class="fleet-slot__button">
                                <img src="/images/fleet-icon.png" />
                            </div>
                            <div class="sleet-slot__label text-xs text-white">
                                Fleet 2
                            </div>
                        </div>
                    </div>
                    <div class="fleet-slot fleet-slot--busy">
                        <div class="fleet-slot__info"></div>
                        <div
                            class="fleet-slot__bottom flex flex-col items-center"
                        >
                            <div class="fleet-slot__button">
                                <img src="/images/fleet-icon.png" />
                            </div>
                            <div class="sleet-slot__label text-xs text-white">
                                Fleet 3
                            </div>
                        </div>
                    </div>
                    <div class="fleet-slot fleet-slot--busy">
                        <div class="fleet-slot__info"></div>
                        <div
                            class="fleet-slot__bottom flex flex-col items-center"
                        >
                            <div class="fleet-slot__button">
                                <img src="/images/fleet-icon.png" />
                            </div>
                            <div class="sleet-slot__label text-xs text-white">
                                Fleet 4
                            </div>
                        </div>
                    </div>
                    <div class="fleet-slot fleet-slot--busy">
                        <div class="fleet-slot__info"></div>
                        <div
                            class="fleet-slot__bottom flex flex-col items-center"
                        >
                            <div class="fleet-slot__button">
                                <img src="/images/fleet-icon.png" />
                            </div>
                            <div class="sleet-slot__label text-xs text-white">
                                Fleet 5
                            </div>
                        </div>
                    </div>
                    <div class="fleet-slot fleet-slot--busy">
                        <div class="fleet-slot__info"></div>
                        <div
                            class="fleet-slot__bottom flex flex-col items-center"
                        >
                            <div class="fleet-slot__button">
                                <img src="/images/fleet-icon.png" />
                            </div>
                            <div class="sleet-slot__label text-xs text-white">
                                Fleet 6
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </BuilderLayout>
</template>

<style lang="less">
.workshop {
    min-height: 100vh;

    .has-admin-bar & {
        min-height: calc(100vh - 32px);
    }
}
</style>

<style lang="less" scoped>
.fleet-slot {
    &__button {
        @apply flex items-center justify-center cursor-pointer;

        background-image: url("/resources/images/hexagon-md.png");
        background-size: contain;
        background-position: center center;
        background-repeat: no-repeat;

        height: 50px;
        width: 50px;

        .fleet-slot--empty & {
            color: #485562;

            &:hover {
                color: #8096ac;
            }
        }

        .fleet-slot--busy & {
            img {
                width: 25px;
            }
        }
    }
}
.grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}
</style>

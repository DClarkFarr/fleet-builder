<script setup>
import { onBeforeMount, ref } from "vue";
import { $vfm } from "vue-final-modal";

import BuilderLayout from "../../components/layouts/BuilderLayout.vue";
import useUserStore from "../../stores/userStore";
import useBuilderStore from "../../stores/builderStore";

import CircleNotchIcon from "~icons/fa-solid/circle-notch";
import AddShipModal from "../../components/Themed/AddShipModal.vue";
import UserShipCard from "../../components/Ship/UserShipCard.vue";
import UserShipModal from "../../components/Themed/UserShipModal.vue";

import CreateWorkshopModal from "../../components/Themed/workshop/CreateWorkshopModal.vue";

const userStore = useUserStore();
const builderStore = useBuilderStore();

const showWorkshopModal = () => {
    $vfm.show({
        component: CreateWorkshopModal,
        bind: {
            onSave: async (data) => {
                await userStore.createWorkshop(data);
                $vfm.hideAll();
            },
        },
    });
};

const showShipsModal = () => {
    $vfm.show({
        component: AddShipModal,
        bind: {
            ships: builderStore.ships,
            shipClasses: builderStore.shipClasses,
            onAdd: async (data) => {
                await userStore.createOrUpdateUserShip(data);
                $vfm.hideAll();
            },
        },
    });
};

const showEditShipModal = (userShip) => {
    $vfm.show({
        component: UserShipModal,
        bind: {
            ship: userShip.ship,
            userShip: userShip,
            onSave: async (data) => {
                await userStore.createOrUpdateUserShip(data);
                $vfm.hideAll();
            },
            onDelete: async (userShip) => {
                await userStore.deleteUserShip(userShip.id_user_ship);
                $vfm.hideAll();
            },
        },
    });
};

const allLoaded = ref(false);

onBeforeMount(() => {
    const def1 = userStore.loadShips();
    const def2 = builderStore.loadShips();
    const def3 = builderStore.loadShipClasses();

    Promise.all([def1, def2, def3]).then(() => {
        allLoaded.value = true;
    });
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
                                    v-if="allLoaded"
                                >
                                    Add Ship
                                </button>
                            </div>
                        </div>
                        <div class="bordered p-4">
                            <template v-if="allLoaded">
                                <div
                                    class="user-ships flex flex-col w-full gap-y-2"
                                >
                                    <UserShipCard
                                        v-for="userShip in userStore.ships"
                                        :key="userShip.id_user_ship"
                                        :userShip="userShip"
                                        @click="showEditShipModal(userShip)"
                                    />
                                </div>
                            </template>
                            <template v-else>
                                <div
                                    class="p-10 flex justify-center items-center text-3xl"
                                >
                                    <CircleNotchIcon class="animate-spin" />
                                </div>
                            </template>
                        </div>
                    </div>
                    <div class="my-fleets__workshops h-full lg:w-1/2">
                        <div class="flex w-full items-end mb-2">
                            <div>
                                <div
                                    class="title leading-none text-2xl text-modal-title font-medium"
                                >
                                    My Workshops
                                </div>
                            </div>
                            <div class="ml-auto">
                                <button
                                    class="btn btn-blue btn-sm ml-4"
                                    @click="showWorkshopModal"
                                    v-if="allLoaded"
                                >
                                    Add Workshop
                                </button>
                            </div>
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

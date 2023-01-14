<script setup>
import { onBeforeMount, ref } from "vue";
import { $vfm } from "vue-final-modal";

import BuilderLayout from "../../components/layouts/BuilderLayout.vue";
import useBuilderStore from "../../stores/builderStore";

import CircleNotchIcon from "~icons/fa-solid/circle-notch";
import AddShipModal from "../../components/Themed/AddShipModal.vue";
import UserShipCard from "../../components/Ship/UserShipCard.vue";
import UserShipModal from "../../components/Themed/UserShipModal.vue";

import CreateWorkshopModal from "../../components/Themed/workshop/CreateWorkshopModal.vue";
import WorkshopListItem from "../../components/Themed/workshop/WorkshopListItem.vue";
import { useRouter } from "vue-router";
import { showConfirmModal } from "../../components/Themed/controls/ConfirmModal.vue";
import { useToast } from "vue-toastification";

const builderStore = useBuilderStore();
const router = useRouter();
const toast = useToast();

const showWorkshopModal = () => {
    $vfm.show({
        component: CreateWorkshopModal,
        bind: {
            onSave: async (data) => {
                await builderStore.createWorkshop(data);
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
                await builderStore.createOrUpdateUserShip(data);
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
                await builderStore.createOrUpdateUserShip(data);
                $vfm.hideAll();
            },
            onDelete: async (userShip) => {
                await builderStore.deleteUserShip(userShip.id_user_ship);
                $vfm.hideAll();
            },
        },
    });
};

const onSelectWorkshop = (workshop) => {
    router.push({
        name: "builder.workshop",
        params: {
            id_workshop: workshop.id_workshop,
        },
    });
};

const onClickDeleteWorkshop = async (workshop) => {
    showConfirmModal({
        title: `Really delete ${
            workshop.arcade ? "arcade" : "simulation"
        } workshop "${workshop.name}" ?`,
        message:
            "On a moral level, it's totally fine. Your ships will be fine, as well. But all fleet configurations will be gone. Proceed?",
        onConfirm: () => {
            onClickDeleteWorkshop2(workshop);
        },
    });
};

const onClickDeleteWorkshop2 = async (workshop) => {
    showConfirmModal({
        title: `For sure?`,
        message: `Think of all the fun you and workshop "${workshop.name}" had together.`,
        onConfirm: () => {
            onClickDeleteWorkshop3(workshop);
        },
    });
};

const onClickDeleteWorkshop3 = async (workshop) => {
    showConfirmModal({
        title: `Last chance for real!`,
        message: `Think of the children...`,
        onConfirm: () => {
            builderStore.deleteWorkshop(workshop.id_workshop);
            toast.info("Workshop delete successfully");
        },
    });
};

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
        <div class="my-fleets flex w-full justify-center items-center">
            <div
                class="my-fleets__content w-full max-w-6xl p-6 text-modal-text"
            >
                <div class="lg:flex w-full items-stretch gap-x-6">
                    <div class="my-fleets__fleets h-full grow">
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
                                    class="user-ships grid grid-cols-2 gap-3 w-full"
                                >
                                    <UserShipCard
                                        v-for="userShip in builderStore.userShips"
                                        :key="userShip.id_user_ship"
                                        :userShip="userShip"
                                        @click="showEditShipModal(userShip)"
                                    />
                                </div>
                                <div
                                    class="placeholder p-10 flex justify-center items-center text-center text-xl h-full"
                                    v-if="!builderStore.userShips.length"
                                >
                                    There are no ships in your fleet. Create
                                    one.
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
                    <div
                        class="my-fleets__workshops h-full shrink lg:max-w-[410px]"
                    >
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
                        <div class="bordered p-4 grid gap-y-2">
                            <template v-if="allLoaded">
                                <WorkshopListItem
                                    v-for="workshop in builderStore.workshops"
                                    :key="workshop.id_workshop"
                                    :workshop="workshop"
                                    :onDelete="onClickDeleteWorkshop"
                                    @select="onSelectWorkshop"
                                />

                                <div
                                    class="flex placeholder p-10 justify-center items-center text-center text-xl h-full"
                                    v-if="!builderStore.workshops.length"
                                >
                                    No workshops yet. Create one!
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
.placeholder {
    @apply text-white;

    mix-blend-mode: overlay;
}
.bordered {
    border: solid 1px #4578a5;
    border-radius: 4px;
    box-shadow: inset 0 0 2px 0px #517090;
    background: fade(#697381, 25%);
}
</style>

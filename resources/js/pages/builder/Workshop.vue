<script setup>
import { onBeforeMount, ref, computed } from "vue";
import { $vfm } from "vue-final-modal";
import DataService from "../../services/DataService";

import { useToast } from "vue-toastification";

import BuilderLayout from "../../components/layouts/BuilderLayout.vue";
import useBuilderStore from "../../stores/builderStore";
import { useRoute } from "vue-router";
import FleetItem from "../../components/Themed/workshop/FleetItem.vue";
import FleetFormModal from "../../components/Themed/workshop/FleetFormModal.vue";

import IconArrowLeft from "~icons/fa-solid/arrow-left";

const route = useRoute();

const fleetLocations = DataService.getFleetLocations();

const builderStore = useBuilderStore();

const allLoaded = ref(false);

const onSelectFleet = (location, fleet) => {
    $vfm.show({
        component: FleetFormModal,
        bind: {
            location,
            fleet,
            excludeSelected: workshop.value.arcade,
            onSave: async (locationSlug, data) => {
                await builderStore.createOrUpdateFleet(
                    workshop.value?.id_workshop,
                    locationSlug,
                    data
                );
                toast.success("Fleet saved successfully");
            },
            onDelete: async (id_workshop_fleet) => {
                await builderStore.deleteFleet(
                    workshop.value?.id_workshop,
                    id_workshop_fleet
                );
                $vfm.hideAll();
            },
            onSelectShip: (id_workshop_fleet, id_user_ship) => {
                return builderStore.addUserShipToFleet(
                    workshop.value?.id_workshop,
                    id_workshop_fleet,
                    id_user_ship
                );
            },
            onUnselectShip: (id_workshop_fleet, id_user_ship) => {
                return builderStore.removeUserShipFromFleet(
                    workshop.value?.id_workshop,
                    id_workshop_fleet,
                    id_user_ship
                );
            },
        },
    });
};

const workshop = computed(() => {
    return builderStore.workshops.find(
        (w) => w.id_workshop === parseInt(route.params.id_workshop)
    );
});

const computedFleetLocations = computed(() => {
    return fleetLocations.map((location) => {
        const fleet = workshop.value?.fleets?.find(
            (f) => f.location === location.slug
        );

        return {
            ...location,
            fleet,
        };
    });
});

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

    const def5 = builderStore.loadWorkshopFleets(route.params.id_workshop);

    Promise.all([def1, def2, def3, def4, def5]).then(() => {
        allLoaded.value = true;
    });
});
</script>
<template>
    <BuilderLayout>
        <div class="workshop max-w-6xl flex flex-col justify-center mx-auto">
            <div class="workshop__heading mb-8">
                <div class="mb-2">
                    <router-link
                        class="text-grow-green-text-alt flex gap-x-2 items-center"
                        :to="{ name: 'builder.fleets' }"
                    >
                        <IconArrowLeft />
                        Back to Fleets
                    </router-link>
                </div>
                <h1 class="text-2xl font-medium mb-2 modal__title">
                    {{ workshop?.name || "Workshop" }}
                </h1>
                <p class="font-xl text-white">
                    {{ workshop?.arcade ? "Arcade" : "Simulation" }}
                </p>
            </div>

            <div class="workshop__content w-full text-modal-text">
                <div class="grid gap-x-4 gap-y-8 w-full">
                    <FleetItem
                        v-for="fleetLocation in computedFleetLocations"
                        :key="fleetLocation.slug"
                        :location="fleetLocation.slug"
                        :locationName="fleetLocation.name"
                        :fleet="fleetLocation.fleet"
                        @select="onSelectFleet"
                    />
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
.grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}
</style>

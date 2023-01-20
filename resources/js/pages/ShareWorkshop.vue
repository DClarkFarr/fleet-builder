<script setup>
import { onBeforeMount, computed, ref } from "vue";
import { useRoute } from "vue-router";
import BuilderLayout from "../components/layouts/BuilderLayout.vue";
import FleetItem from "../components/Themed/workshop/FleetItem.vue";
import DataService from "../services/DataService";
import useBuilderStore from "../stores/builderStore";
import IconCircleNotch from "~icons/fa-solid/circle-notch";

const fleetLocations = DataService.getFleetLocations();

const builderStore = useBuilderStore();

const route = useRoute();

const isLoaded = ref(false);

const workshop = computed(() => {
    return builderStore.workshops.find(
        (w) => w.id_workshop === parseInt(route.params.id_workshop)
    );
});

const computedFleetLocations = computed(() => {
    console.log("computing fleet locations");
    return fleetLocations.map((location) => {
        const fleet = builderStore.selectedFleets?.find(
            (f) => f.location === location.slug
        );

        return {
            ...location,
            statTotals: fleet
                ? builderStore.selectedFleetsStats?.[fleet.id_workshop_fleet] ||
                  null
                : null,
            fleet,
        };
    });
});

onBeforeMount(async () => {
    await builderStore.loadSharedWorkshop(route.params.id_workshop);

    isLoaded.value = true;
});
</script>

<template>
    <BuilderLayout>
        <div
            class="workshop max-w-6xl flex flex-col justify-center mx-auto py-10"
        >
            <div class="workshop__heading mb-8">
                <div class="flex items-center">
                    <div>
                        <h1
                            class="text-2xl font-medium mb-2 modal__title flex gap-x-3"
                        >
                            <span v-if="workshop?.user.alliance">
                                {{ workshop.user.alliance }}
                            </span>
                            <span v-if="workshop?.user.name">
                                {{ workshop.user.name }}
                            </span>
                            <span v-if="workshop?.user.name"> > </span>
                            <span class="italic font-thin">
                                {{ workshop?.name || "Workshop" }}
                            </span>
                        </h1>
                        <p class="font-xl text-white">
                            {{ workshop?.arcade ? "Arcade" : "Simulation" }}
                        </p>
                    </div>
                </div>
            </div>

            <div class="workshop__content w-full text-modal-text">
                <template v-if="!isLoaded">
                    <div
                        class="p-10 flex w-full justify-center items-center text-2xl"
                    >
                        <IconCircleNotch class="animate-spin" />
                    </div>
                </template>
                <div class="grid gap-x-4 gap-y-8 w-full">
                    <template v-if="isLoaded">
                        <FleetItem
                            v-for="fleetLocation in computedFleetLocations"
                            :key="fleetLocation.slug"
                            :location="fleetLocation.slug"
                            :locationName="fleetLocation.name"
                            :fleet="fleetLocation.fleet"
                            :statTotals="fleetLocation.statTotals"
                            :isPublic="true"
                            :withTags="true"
                        />
                    </template>
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

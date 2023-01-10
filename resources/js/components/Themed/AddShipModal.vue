<script setup>
import ContentBox from "./ContentBox.vue";

import { ref, reactive, computed } from "vue";
import ShipSelectCard from "../Ship/ShipSelectCard.vue";

const props = defineProps({
    ships: {
        type: Array,
        required: true,
    },
    shipClasses: {
        type: Array,
        required: true,
    },
    onAdd: {
        type: Function,
        required: true,
    },
});

const selectedShip = ref(null);

const filters = reactive({
    search: "",
    id_class: null,
});

const hasFilters = computed(() => {
    return Object.values(filters).some((v) => !!v);
});

const onClearFilters = () => {
    filters.search = "";
    filters.id_class = null;
};

const onClickSelect = (ship) => {
    selectedShip.value = ship;
};

const computedShips = computed(() => {
    let ships = [...props.ships];

    if (filters.search) {
        ships = ships.filter((ship) => {
            return ship.name
                .toLowerCase()
                .includes(filters.search.toLowerCase());
        });
    }

    if (filters.id_class) {
        ships = ships.filter((ship) => {
            return ship.id_class === filters.id_class;
        });
    }

    return ships;
});
</script>

<template>
    <vue-final-modal
        classes="modal-container"
        content-class="w-full modal-content--xl"
    >
        <ContentBox class="w-full" bg-class="custom-bg">
            <div class="add-ship">
                <h2 class="text-xl text-modal-title font-medium mb-4">
                    Add a ship to your fleet
                </h2>

                <template v-if="selectedShip">
                    <div class="flex gap-x-4 items-center">
                        <div>
                            <button
                                class="btn btn-sm btn-red"
                                @click="selectedShip = null"
                            >
                                Unselect Ship
                            </button>
                        </div>
                        <div>
                            <h2 class="text-xl text-modal-title">
                                Add <b>{{ selectedShip.name }}</b> to your fleet
                            </h2>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div
                        class="add-ship__filters flex gap-x-4 items-center mb-4"
                    >
                        <div>
                            <div class="text-modal-title font-medium">
                                Filter by name
                            </div>
                            <input
                                type="text"
                                class="input input--search"
                                placeholder="Search by name..."
                                v-model="filters.search"
                            />
                        </div>
                        <div>
                            <div class="text-modal-title font-medium">
                                Filter by class
                            </div>
                            <VSelect
                                :options="shipClasses"
                                :reduce="(x) => x.id_class"
                                :searchable="true"
                                :clearable="true"
                                label="name"
                                v-model="filters.id_class"
                            />
                        </div>
                        <div v-if="hasFilters" class="pt-6">
                            <button
                                class="btn btn-sm btn-red"
                                @click="onClearFilters"
                            >
                                Clear filters
                            </button>
                        </div>
                    </div>
                    <div class="add-ships__list flex flex-col w-full gap-y-2">
                        <ShipSelectCard
                            v-for="ship in computedShips"
                            :key="ship.id_ship"
                            :ship="ship"
                        >
                            <template #actions>
                                <button
                                    class="btn btn-sm btn-green"
                                    @click="onClickSelect(ship)"
                                >
                                    Select
                                </button>
                            </template>
                        </ShipSelectCard>
                    </div>
                </template>
            </div>
        </ContentBox>
    </vue-final-modal>
</template>

<style lang="less">
.custom-bg {
    background: rgba(87, 122, 150, 0.5);
}
</style>

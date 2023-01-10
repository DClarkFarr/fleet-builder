<script setup>
import ContentBox from "./ContentBox.vue";

import { ref, reactive, computed } from "vue";

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
                    You selected a ship! Show form
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
                        <div
                            class="ship ship-box"
                            :class="[
                                'ship-box--' +
                                    ship.ship_level.name.toLowerCase(),
                            ]"
                            v-for="ship in computedShips"
                            :key="ship.id_ship"
                        >
                            <div class="ship-box__content">
                                <div class="ship-box__content-bg p-2">
                                    <div>Power {{ ship.energy }}</div>
                                    <div>
                                        {{ ship.abilities.length }} Abilities
                                    </div>
                                    <div>Weapon Strength</div>
                                </div>
                            </div>
                            <div class="ship-box__caption">
                                {{ ship.name }}
                            </div>
                        </div>
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

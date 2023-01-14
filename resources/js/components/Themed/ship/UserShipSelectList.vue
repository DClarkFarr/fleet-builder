<script setup>
import { computed, reactive, ref, watch } from "vue";

import UserShipCard from "../../Ship/UserShipCard.vue";
import IconCircleNotch from "~icons/fa-solid/circle-notch";

const props = defineProps({
    userShips: {
        type: Array,
        required: true,
    },
    shipClasses: {
        type: Array,
        required: true,
    },
    busy: {
        type: Boolean,
        default: false,
    },
    energyLimit: {
        type: Number,
        default: null,
    },
});

const emit = defineEmits(["select", "unselect"]);

const onClickSelect = (userShip) => {
    emit("select", userShip);
};

const onClickUnselect = (userShip) => {
    emit("unselect", userShip);
};

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

const hasEnergyLimit = computed(() => {
    return props.energyLimit !== null;
});

const checkEnergyLimit = (energy) => {
    if (!hasEnergyLimit.value) {
        return true;
    }

    return energy <= props.energyLimit;
};

const computedUserShips = computed(() => {
    let userShips = [...props.userShips];

    if (filters.search) {
        userShips = userShips.filter((userShip) => {
            return userShip.ship.name
                .toLowerCase()
                .includes(filters.search.toLowerCase());
        });
    }

    if (filters.id_class) {
        userShips = userShips.filter((userShip) => {
            return userShip.ship.id_class === filters.id_class;
        });
    }

    return userShips;
});
</script>

<template>
    <div class="add-ship__filters flex gap-x-4 items-center mb-4">
        <div>
            <div class="text-modal-title font-medium">Filter by name</div>
            <input
                type="text"
                class="input input--search"
                placeholder="Search by name..."
                v-model="filters.search"
            />
        </div>
        <div>
            <div class="text-modal-title font-medium">Filter by class</div>
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
            <button class="btn btn-sm btn-red" @click="onClearFilters">
                Clear filters
            </button>
        </div>
    </div>
    <div class="add-ships__list flex flex-col w-full gap-y-2">
        <UserShipCard
            v-for="userShip in computedUserShips"
            :key="userShip.id_user_ship"
            :userShip="userShip"
        >
            <template #actions>
                <template v-if="busy">
                    <button class="btn btn-sm btn-gray" disabled>
                        <IconCircleNotch class="animate-spin" />
                    </button>
                </template>
                <template v-else-if="userShip.selected">
                    <button
                        class="btn btn-sm btn-red"
                        @click="onClickUnselect(userShip)"
                    >
                        Unselect
                    </button>
                </template>
                <template v-else>
                    <template v-if="checkEnergyLimit(userShip.ship.energy)">
                        <button
                            class="btn btn-sm btn-green"
                            @click="onClickSelect(userShip)"
                        >
                            Select
                        </button>
                    </template>
                    <template v-else>
                        <button class="btn btn-sm btn-gray" disabled>
                            Not enough energy
                        </button>
                    </template>
                </template>
            </template>
        </UserShipCard>
    </div>
</template>

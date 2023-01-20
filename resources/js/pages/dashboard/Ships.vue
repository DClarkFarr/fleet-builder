<script setup>
import { ref, onMounted } from "vue";
import DashboardLayout from "../../components/layouts/DashboardLayout.vue";
import ShipService from "../../services/ShipService";
import CircleNotchIcon from "~icons/fa-solid/circle-notch";
import PencilIcon from "~icons/fa-solid/pencil-alt";
import { parseShipSlotCounts } from "../../methods/ship";

const ships = ref([]);
const isLoading = ref(true);
const errorMessage = ref("");

onMounted(async () => {
    try {
        ships.value = (await ShipService.getShips({ public: false })).map(
            (s) => {
                parseShipSlotCounts(s);

                return s;
            }
        );
    } catch (err) {
        errorMessage.value = err.message;
    }

    isLoading.value = false;
});
</script>

<template>
    <DashboardLayout>
        <div class="lg:flex mb-8 items-center">
            <div>
                <h1 class="font-medium text-2xl">Ships</h1>
            </div>
            <div class="ml-auto">
                <router-link
                    class="btn bg-sky-600 hover:bg-sky-800"
                    :to="{ name: 'dashboard.ships.create' }"
                >
                    Add Ship
                </router-link>
            </div>
        </div>

        <div class="ships-list">
            <template v-if="isLoading">
                <div class="flex justify-center items-center h-[300px]">
                    <CircleNotchIcon class="animate-spin h-10 w-10" />
                </div>
            </template>
            <template v-else-if="errorMessage">
                <div class="p-4 bg-red-100 text-red-600 rounded-lg my-10">
                    {{ errorMessage }}
                </div>
            </template>
            <template v-else>
                <table class="w-full" cellpadding="0" cellspacing="0">
                    <thead>
                        <tr>
                            <th class="text-left">Ship</th>
                            <th class="text-left">Level / Class</th>
                            <th class="text-left">Power</th>
                            <th class="text-left">Slots</th>
                            <th class="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="ship in ships"
                            :key="ship.id_ship"
                            :data-id-ship="ship.id_ship"
                        >
                            <td>
                                {{ ship.name }}
                            </td>
                            <td>
                                {{ ship.ship_level.name }} /
                                {{ ship.ship_class.name }}
                            </td>
                            <td>
                                {{ ship.energy }}
                            </td>
                            <td>
                                <div class="text-sm text-gray-500 flex gap-x-2">
                                    <span>
                                        W:
                                        {{ ship.slotCounts.weapon.total }}
                                    </span>
                                    <span>
                                        A: {{ ship.slotCounts.armor.total }}
                                    </span>
                                    <span>
                                        U: {{ ship.slotCounts.unit.total }}
                                    </span>
                                </div>
                            </td>
                            <td class="w-20 text-right">
                                <router-link
                                    class="btn bg-sky-600 hover:bg-sky-800"
                                    :to="{
                                        name: 'dashboard.ships.edit',
                                        params: { id: ship.id_ship },
                                    }"
                                >
                                    <PencilIcon />
                                </router-link>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </template>
        </div>
    </DashboardLayout>
</template>

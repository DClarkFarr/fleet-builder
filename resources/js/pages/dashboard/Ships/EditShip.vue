<script setup>
import { computed, ref, onMounted, nextTick } from "vue";
import DashboardLayout from "../../../components/layouts/DashboardLayout.vue";
import BasicShipForm from "../../../components/Ship/BasicShipForm.vue";
import CircleNotchIcon from "~icons/fa-solid/circle-notch";
import { useRoute } from "vue-router";
import ShipService from "../../../services/ShipService";
import apiClient from "../../../services/apiClient";
import SlotsForm from "../../../components/Ship/SlotsForm.vue";
import DataService from "../../../services/DataService";
import AbilityItem from "../../../components/Ability/AbilityItem.vue";

const ship = ref(null);
const isLoading = ref(true);
const route = useRoute();

const sizes = DataService.getSizes();
const slotTypes = DataService.SLOT_TYPES;

const allLocations = DataService.getShipAbilityLocations();

const abilityLocations = allLocations.filter((l) => !l.isChip);
const chipLocations = allLocations.filter((l) => l.isChip);

const loadShip = async () => {
    const { id } = route.params;
    try {
        const res = await ShipService.getShip(id);
        ship.value = res;
    } catch (err) {
        console.warn(err, "error loading ship");
    }

    isLoading.value = false;
};

const onUpdateShip = (form, resolve, reject) => {
    apiClient
        .put(`admin/ship/${ship.value.id_ship}`, form)
        .then(async (res) => {
            ship.value = res.data.row;
            await nextTick();
            resolve();
        })
        .catch((err) => {
            if (err.response?.data?.errors) {
                const errors = {};
                for (const [key, value] of Object.entries(
                    err.response.data.errors
                )) {
                    errors[key] = value[0];
                }
                reject(errors);
            } else {
                let message = err.response?.data?.message || err.message;
                reject(message);
            }
        });
};

const onSaveSlots = (type, slots) => {
    const data = {
        type,
        slots,
    };

    return apiClient.put(`admin/ship/${ship.value.id_ship}/slots`, data);
};

const onSaveAbilities = (location, abilities) => {
    return apiClient.put(`admin/ship/${ship.value.id_ship}/abilit`, {
        location,
        abilities,
    });
};

const shipAbilitiesByLocation = computed(() => {
    return ship.value?.abilities.reduce((obj, ability) => {
        if (!obj[ability.location]) {
            obj[ability.location] = [];
        }

        obj[ability.location].push(ability);

        return obj;
    }, {});
});

onMounted(() => {
    loadShip();
});
</script>

<template>
    <DashboardLayout>
        <div class="lg:flex mb-8 items-center gap-x-2">
            <div>
                <router-link
                    class="text-sky-600"
                    :to="{ name: 'dashboard.ships' }"
                >
                    Back
                </router-link>
            </div>

            <div>
                <h1 class="font-medium text-2xl">Edit Ship</h1>
            </div>
        </div>

        <div
            class="p-20 flex items-center justify-center text-center"
            v-if="isLoading"
        >
            <div>
                <CircleNotchIcon class="animate-spin h-10 w-10 text-sky-600" />
                <br />
            </div>
        </div>
        <div v-else-if="!ship">
            <div class="p-20 flex items-center justify-center">
                <h1 class="font-medium text-2xl">Ship not found</h1>
            </div>
        </div>
        <div v-else>
            <div class="mb-8">
                <h3 class="font-medium text-xl mb-4">Basic Ship Info</h3>
                <BasicShipForm :ship="ship" @submit="onUpdateShip" />
            </div>
            <hr />

            <div class="mb-8 mt-8">
                <h3 class="font-2xl mb-4 font-medium text-xl">Ship Slots</h3>
                <div class="slots grid gap-1">
                    <SlotsForm
                        :slots="ship.ship_weapon_slots"
                        :sizes="sizes"
                        :type="slotTypes.WEAPON"
                        :onSave="onSaveSlots"
                        label="Weapon Slots"
                    />
                    <SlotsForm
                        :slots="ship.ship_armor_slots"
                        :sizes="sizes"
                        :type="slotTypes.ARMOR"
                        :onSave="onSaveSlots"
                        label="Armor Slots"
                    />
                    <SlotsForm
                        :slots="ship.ship_unit_slots"
                        :sizes="sizes"
                        :type="slotTypes.UNIT"
                        :onSave="onSaveSlots"
                        label="Unit Slots"
                    />
                </div>
            </div>
            <hr />
            <div class="my-8">
                <h3 class="font-2xl mb-4 font-medium text-xl">
                    Ship Abilities
                </h3>
                <div class="abilities grid gap-1">
                    <AbilityItem
                        v-for="location in abilityLocations"
                        :key="location.slug"
                        :location="location.slug"
                        :location-name="location.name"
                        :abilities="shipAbilitiesByLocation[location.slug]"
                        :onSave="onSaveAbilities"
                    />
                </div>
            </div>
        </div>
    </DashboardLayout>
</template>

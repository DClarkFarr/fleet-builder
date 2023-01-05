<script setup>
import { computed, ref, onMounted, nextTick } from "vue";
import DashboardLayout from "../../../components/layouts/DashboardLayout.vue";
import BasicShipForm from "../../../components/Ship/BasicShipForm.vue";
import CircleNotchIcon from "~icons/fa-solid/circle-notch";
import { useRoute } from "vue-router";
import ShipService from "../../../services/ShipService";
import apiClient from "../../../services/apiClient";

const ship = ref(null);
const isLoading = ref(true);
const route = useRoute();

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
                    :to="{ name: 'dashboard.ships.create' }"
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
            <div class="mb-10">
                <h3 class="font-medium">Basic Ship Info</h3>
                <BasicShipForm :ship="ship" @submit="onUpdateShip" />
            </div>
            <hr />
        </div>
    </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import DashboardLayout from "../../components/layouts/DashboardLayout.vue";
import LevelForm from "../../components/Ship/LevelForm.vue";

import apiClient from "../../services/apiClient";
import ShipService from "../../services/ShipService";

const shipLevels = ref([]);

const nextLevelSort = computed(() => {
    return shipLevels.value.length + 1;
});

const loadLevels = async () => {
    const levels = await ShipService.getShipLevels();

    shipLevels.value = levels;
};

const onCreateLevel = (form, resolve, reject) => {
    apiClient
        .post("admin/ship/level", form)
        .then((res) => {
            shipLevels.value.push(res.data.row);
            resolve();
            loadLevels();
        })
        .catch((err) => {
            let message = err.response?.data?.message || err.message;
            if (err.response?.data?.errors) {
                const firstField = Object.keys(err.response.data.errors)[0];
                message = err.response.data.errors[firstField][0];
            }

            reject(message);
        });
};

const onUpdateLevel = (id_level, form, resolve, reject) => {
    apiClient
        .put(`admin/ship/level/${id_level}`, form)
        .then((res) => {
            const index = shipLevels.value.findIndex(
                (c) => c.id_level === res.data.row.id_level
            );
            shipLevels.value.splice(index, 1, res.data.row);
            resolve();
            loadLevels();
        })
        .catch((err) => {
            let message = err.response?.data?.message || err.message;
            if (err.response?.data?.errors) {
                const firstField = Object.keys(err.response.data.errors)[0];
                message = err.response.data.errors[firstField][0];
            }

            reject(message);
        });
};

const onDeleteClass = (id_level, form, resolve, reject) => {
    apiClient
        .delete(`admin/ship/level/${id_level}`)
        .then(() => {
            const index = shipLevels.value.findIndex(
                (c) => c.id_level === id_level
            );
            shipLevels.value.splice(index, 1);
            resolve();
            loadLevels();
        })
        .catch((err) => {
            console.log("caught error", err);
            let message = err.response?.data?.message || err.message;

            reject(message);
        });
};

onMounted(() => {
    loadLevels();
});
</script>

<template>
    <DashboardLayout>
        <h1 class="font-medium text-2xl mb-8">Ship Levels</h1>

        <div class="levels-list mb-8 grid gap-y-2">
            <LevelForm
                v-for="shipLevel in shipLevels"
                :key="shipLevel.id_level"
                :ship-level="shipLevel"
                @submit="(...xs) => onUpdateLevel(shipLevel.id_level, ...xs)"
                @delete="(...xs) => onDeleteClass(shipLevel.id_level, ...xs)"
            />
        </div>

        <div class="new-class">
            <h2 class="font-medium text-xl mb-4">New Ship Class</h2>
            <LevelForm :next-sort="nextLevelSort" @submit="onCreateLevel" />
        </div>
    </DashboardLayout>
</template>

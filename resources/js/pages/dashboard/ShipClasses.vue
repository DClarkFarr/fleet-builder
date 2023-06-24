<script setup>
import { ref, computed, onMounted } from "vue";
import DashboardLayout from "../../components/layouts/DashboardLayout.vue";
import ClassForm from "../../components/Ship/ClassForm.vue";

import apiClient from "../../services/apiClient";
import ShipService from "../../services/ShipService";

const shipClasses = ref([]);

const nextShipSort = computed(() => {
    return shipClasses.value.length + 1;
});

const loadClasses = async () => {
    const classes = await ShipService.getShipClasses();

    shipClasses.value = classes;
};

const onCreateClass = (form, resolve, reject) => {
    apiClient
        .post("admin/ship/class", form)
        .then((res) => {
            shipClasses.value.push(res.data.row);
            resolve();
            loadClasses();
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

const onUpdateClass = (id_class, form, resolve, reject) => {
    apiClient
        .put(`admin/ship/class/${id_class}`, form)
        .then((res) => {
            const index = shipClasses.value.findIndex(
                (c) => c.id_class === res.data.row.id_class
            );
            shipClasses.value.splice(index, 1, res.data.row);
            resolve();
            loadClasses();
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

const onDeleteClass = (id_class, form, resolve, reject) => {
    apiClient
        .delete(`admin/ship/class/${id_class}`)
        .then(() => {
            const index = shipClasses.value.findIndex(
                (c) => c.id_class === id_class
            );
            shipClasses.value.splice(index, 1);
            resolve();
            loadClasses();
        })
        .catch((err) => {
            let message = err.response?.data?.message || err.message;

            reject(message);
        });
};

onMounted(() => {
    loadClasses();
});
</script>

<template>
    <DashboardLayout>
        <h1 class="font-medium text-2xl mb-8">Ship Classes</h1>

        <div class="classes-list mb-8 grid gap-y-2">
            <ClassForm
                v-for="shipClass in shipClasses"
                :key="shipClass.id_class"
                :ship-class="shipClass"
                @submit="(...xs) => onUpdateClass(shipClass.id_class, ...xs)"
                @delete="(...xs) => onDeleteClass(shipClass.id_class, ...xs)"
            />
        </div>

        <div class="new-class">
            <h2 class="font-medium text-xl mb-4">New Ship Class</h2>
            <ClassForm :next-sort="nextShipSort" @submit="onCreateClass" />
        </div>
    </DashboardLayout>
</template>

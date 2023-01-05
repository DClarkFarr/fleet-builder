<script setup>
import { ref, computed } from "vue";
import DashboardLayout from "../../components/layouts/DashboardLayout.vue";
import ClassForm from "../../components/Ship/ClassForm.vue";

import apiClient from "../../services/apiClient";

const shipClasses = ref([]);

const nextShipSort = computed(() => {
    return shipClasses.value.length + 1;
});

const onCreateClass = (form, resolve, reject) => {
    apiClient
        .post("admin/ship/class", form)
        .then((res) => {
            shipClasses.value.push(res.data.class);
            resolve();
        })
        .catch((err) => {
            let message = err.response?.data?.message || error.message;
            if (err.response?.data?.errors) {
                const firstField = Object.keys(err.response.data.errors)[0];
                message = err.response.data.errors[firstField][0];
            }

            reject(message);
        });
};
</script>

<template>
    <DashboardLayout>
        <h1 class="font-medium text-2xl mb-8">Ship Classes</h1>

        <div class="classes-list mb-8"></div>
        <div class="new-class">
            <h2 class="font-medium text-xl mb-4">New Ship Class</h2>
            <ClassForm :next-sort="nextShipSort" @submit="onCreateClass" />
        </div>
    </DashboardLayout>
</template>

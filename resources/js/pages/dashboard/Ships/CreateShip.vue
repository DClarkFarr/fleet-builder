<script setup>
import { useRouter } from "vue-router";
import DashboardLayout from "../../../components/layouts/DashboardLayout.vue";
import BasicShipForm from "../../../components/Ship/BasicShipForm.vue";
import apiClient from "../../../services/apiClient";

const router = useRouter();

const onCreateShip = (form, resolve, reject) => {
    apiClient
        .post("admin/ship", form)
        .then((res) => {
            resolve();
            router.push({
                name: "dashboard.ships.edit",
                params: { id: res.data.row.id_ship },
            });
        })
        .catch((err) => {
            if (err.response?.data?.errors) {
                const errors = {};
                Object.entries(err.response.data.errors).forEach(
                    ([key, value]) => {
                        errors[key] = value[0];
                    }
                );
                reject(errors);
            } else {
                let message = err.response?.data?.message || err.message;
                reject(message);
            }
        });
};
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
                <h1 class="font-medium text-2xl">Create Ship</h1>
            </div>
        </div>

        <BasicShipForm @submit="onCreateShip" />
    </DashboardLayout>
</template>

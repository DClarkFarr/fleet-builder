<script setup>
import { useRouter } from "vue-router";
import DashboardLayout from "../../../components/layouts/DashboardLayout.vue";
import BasicAdmiralForm from "../../../components/Admiral/BasicAdmiralForm.vue";
import apiClient from "../../../services/apiClient";

const router = useRouter();

const onCreateAdmiral = (form, resolve, reject) => {
    apiClient
        .post("admin/admiral", form)
        .then((res) => {
            resolve();
            router.push({
                name: "dashboard.admirals.edit",
                params: { id: res.data.row.id_admiral },
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
                    :to="{ name: 'dashboard.admirals' }"
                >
                    Back
                </router-link>
            </div>
            <div>
                <h1 class="font-medium text-2xl">Create Admiral</h1>
            </div>
        </div>

        <BasicAdmiralForm @submit="onCreateAdmiral" />
    </DashboardLayout>
</template>

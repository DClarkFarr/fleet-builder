<script setup>
import { ref, onMounted, nextTick } from "vue";
import DashboardLayout from "../../../components/layouts/DashboardLayout.vue";
import BasicAdmiralForm from "../../../components/Admiral/BasicAdmiralForm.vue";
import CircleNotchIcon from "~icons/fa-solid/circle-notch";
import { useRoute } from "vue-router";
import AdmiralService from "../../../services/AdmiralService";
import apiClient from "../../../services/apiClient";
import AdmiralSkillManager from "../../../components/Admiral/AdmiralSkillManager.vue";

const admiral = ref(null);
const isLoading = ref(true);
const route = useRoute();

const loadAdmiral = async () => {
    const { id } = route.params;
    try {
        const res = await AdmiralService.getAdmiral(id);

        admiral.value = res;
    } catch (err) {
        console.warn(err, "error loading admiral");
    }

    isLoading.value = false;
};

const onUpdateAdmiral = (form, resolve, reject) => {
    apiClient
        .put(`admin/admiral/${admiral.value.id_admiral}`, form)
        .then(async (res) => {
            admiral.value = res.data.row;
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
    loadAdmiral();
});
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
                <h1 class="font-medium text-2xl">Edit Admiral</h1>
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
        <div v-else-if="!admiral">
            <div class="p-20 flex items-center justify-center">
                <h1 class="font-medium text-2xl">Admiral not found</h1>
            </div>
        </div>
        <div v-else>
            <div class="mb-8">
                <h3 class="font-medium text-xl mb-4">Basic Admiral Info</h3>
                <BasicAdmiralForm
                    v-model:admiral="admiral"
                    @submit="onUpdateAdmiral"
                />
            </div>
            <AdmiralSkillManager v-model:admiral="admiral" />
        </div>
    </DashboardLayout>
</template>

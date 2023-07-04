<script setup>
import { ref, onMounted } from "vue";
import DashboardLayout from "../../components/layouts/DashboardLayout.vue";
import AdmiralService from "../../services/AdmiralService";
import CircleNotchIcon from "~icons/fa-solid/circle-notch";
import PencilIcon from "~icons/fa-solid/pencil-alt";
import IconExclamationTriangle from "~icons/fa-solid/exclamation-triangle";
const admirals = ref([]);
const isLoading = ref(true);
const errorMessage = ref("");

onMounted(async () => {
    try {
        admirals.value = await AdmiralService.getAdmirals({ public: false });
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
                <h1 class="font-medium text-2xl">Admirals</h1>
            </div>
            <div class="ml-auto">
                <router-link
                    class="btn bg-sky-600 hover:bg-sky-800"
                    :to="{ name: 'dashboard.admirals.create' }"
                >
                    Add Admiral
                </router-link>
            </div>
        </div>

        <div class="admirals-list">
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
                            <th class="text-left">Admiral</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="admiral in admirals"
                            :key="admiral.id_admiral"
                            :data-id-admiral="admiral.id_admiral"
                        >
                            <td>
                                <div class="flex gap-x-2 items-center">
                                    <div
                                        v-if="!admiral.public"
                                        class="text-lg text-red-600 flex gap-x-2"
                                    >
                                        <IconExclamationTriangle />
                                        <span class="text-base"> Public </span>
                                    </div>
                                    <div>
                                        {{ admiral.name }}
                                    </div>
                                </div>
                            </td>

                            <td class="w-20 text-right">
                                <router-link
                                    class="btn bg-sky-600 hover:bg-sky-800"
                                    :to="{
                                        name: 'dashboard.admirals.edit',
                                        params: { id: admiral.id_admiral },
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

<style lang="less" scoped>
.admirals-list {
    tr:hover td {
        background: #eaeaea;
    }
}
</style>

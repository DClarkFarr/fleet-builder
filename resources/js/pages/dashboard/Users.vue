<script setup>
import { onMounted, ref } from "vue";
import DashboardLayout from "../../components/layouts/DashboardLayout.vue";
import apiClient from "../../services/apiClient";

const users = ref([]);

const isLoading = ref(true);

onMounted(async () => {
    try {
        users.value = await apiClient
            .get("/admin/user")
            .then((res) => res.data.rows);
    } catch (err) {
        errorMessage.value = err.message;
    }

    isLoading.value = false;
});
</script>

<template>
    <DashboardLayout>
        <h1 class="text-2xl font-medium mb-10">Users</h1>
        <table class="table w-full">
            <thead>
                <tr>
                    <th class="text-left">Alliance</th>
                    <th class="text-left">Name</th>
                    <th class="text-left">Email</th>
                    <th class="text-left">Roles</th>
                    <th class="text-left">Date</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in users" :key="user.id">
                    <td>{{ user.alliance }}</td>
                    <td>{{ user.name }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ user.roles?.join(", ") || "N/A" }}</td>
                    <td>{{ user.created_at }}</td>
                </tr>
            </tbody>
        </table>
    </DashboardLayout>
</template>

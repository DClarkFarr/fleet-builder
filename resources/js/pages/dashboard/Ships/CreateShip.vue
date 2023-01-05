<script setup>
import DashboardLayout from "../../../components/layouts/DashboardLayout.vue";
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
    </DashboardLayout>
</template>

<script setup>
import DashboardLayout from "../../components/layouts/DashboardLayout.vue";
</script>

<template>
    <DashboardLayout>
        <div class="lg:flex mb-8 items-center">
            <div>
                <h1 class="font-medium text-2xl">Ships</h1>
            </div>
            <div class="ml-auto">
                <router-link
                    class="btn bg-sky-600 hover:bg-sky-800"
                    :to="{ name: 'dashboard.ships.create' }"
                >
                    Add Ship
                </router-link>
            </div>
        </div>
    </DashboardLayout>
</template>

<script setup>
import FeLayout from "../components/layouts/FeLayout.vue";
import LoginForm from "../components/User/LoginForm.vue";
</script>
<template>
    <FeLayout>
        <div class="p-6">
            <h1 class="modal__title text-center text-2xl font-medium mb-6">
                Login
            </h1>
            <LoginForm />
        </div>
    </FeLayout>
</template>

<script setup>
import FeLayout from "../components/layouts/FeLayout.vue";
import SignupForm from "../components/User/SignupForm.vue";
</script>
<template>
    <FeLayout>
        <div class="p-6">
            <h1 class="modal__title text-center text-2xl font-medium mb-6">
                Create Account
            </h1>
            <SignupForm />
        </div>
    </FeLayout>
</template>

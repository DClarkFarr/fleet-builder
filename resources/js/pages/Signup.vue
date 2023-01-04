<script setup>
import UserLayout from "../components/layouts/UserLayout.vue";
import SignupForm from "../components/User/SignupForm.vue";
</script>
<template>
    <UserLayout>
        <div class="bg-gray-300 rounded-lg p-6 max-w-lg">
            <h1>Create Account</h1>
            <SignupForm />
        </div>
    </UserLayout>
</template>

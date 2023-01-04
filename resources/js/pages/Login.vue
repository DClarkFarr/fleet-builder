<script setup>
import UserLayout from "../components/layouts/UserLayout.vue";
import LoginForm from "../components/User/LoginForm.vue";
</script>
<template>
    <UserLayout>
        <div class="bg-gray-300 rounded-lg p-6 max-w-lg">
            <h1>Login</h1>
            <LoginForm />
        </div>
    </UserLayout>
</template>

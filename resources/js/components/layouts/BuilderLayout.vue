<script setup>
import UserLayout from "./UserLayout.vue";
</script>

<template>
    <UserLayout class="themed">
        <div class="view view space-bg">
            <slot></slot>
        </div>
    </UserLayout>
</template>

<style lang="less"></style>

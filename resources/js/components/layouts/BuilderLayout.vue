<script setup>
import UserLayout from "./UserLayout.vue";
</script>

<template>
    <UserLayout class="themed">
        <div class="view view space-bg">
            <slot></slot>
        </div>
        <modals-container></modals-container>
    </UserLayout>
</template>

<style lang="less" scoped>
:deep(.vfm--overlay) {
    background-color: rgba(0, 0, 0, 0.85);
}
</style>

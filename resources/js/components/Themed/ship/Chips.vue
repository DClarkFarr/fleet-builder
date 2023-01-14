<script setup>
const props = defineProps({
    total: {
        type: Number,
        required: true,
    },
    chipLevel: {
        type: Number,
        required: true,
    },
    height: {
        type: String,
        default: "12px",
    },
});
</script>

<template>
    <div
        class="chips flex gap-x-[2px] cursor-pointer"
        v-tooltip="'Chip level: ' + chipLevel"
        :style="{ '--height': height }"
    >
        <div
            class="chip"
            v-for="i of total"
            :key="i"
            :class="{
                'chip--unlocked': i <= chipLevel,
            }"
        ></div>
    </div>
</template>

<style lang="less" scoped>
.chip {
    @apply leading-none text-box-gray-text;

    background: #272940;

    width: 3px;

    height: var(--height);

    &--unlocked {
        @apply bg-weapon-btn-border-2-hover text-btn-yellow-bg;
    }
}
</style>

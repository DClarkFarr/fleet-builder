<script setup>
import { computed } from "vue";

const props = defineProps({
    error: {
        type: String,
        default: "",
    },
    dirty: {
        type: Boolean,
        default: null,
    },
});

const show = computed(() => {
    return props.error && (props.dirty || props.dirty === null);
});
</script>

<template>
    <div class="text-red-600 font-sm" v-if="show">
        {{ error }}
    </div>
</template>

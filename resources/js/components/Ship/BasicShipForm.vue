<script setup>
import { reactive } from "vue";

const emit = defineEmits(["submit"]);

const props = defineProps({
    ship: {
        type: Object,
        default: null,
    },
});

const form = reactive({
    name: "",
});
</script>

<template></template>

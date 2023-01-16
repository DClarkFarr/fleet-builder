<script setup>
import { computed } from "vue";

const props = defineProps({
    parsedAbilities: {
        type: Object,
        required: true,
    },
});

const parsedAbilitiesList = computed(() => {
    return [
        ...props.parsedAbilities.flagship,
        ...props.parsedAbilities.core,
        ...props.parsedAbilities.chip,
    ];
});
</script>

<template>
    <div class="fleet-ability-stats"></div>
</template>

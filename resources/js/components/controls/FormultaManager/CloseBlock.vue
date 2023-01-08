<script setup>
import BlockBase from "./BlockBase.vue";
import useBlock from "./useBlock";

const props = defineProps({
    block: {
        type: Object,
        required: true,
    },
});
</script>

<template>
    <BlockBase :block="block" :clickable="false">
        <template #label>
            <div>&nbsp;</div>
        </template>
        <template #toggle>
            <span> ) </span>
        </template>
    </BlockBase>
</template>

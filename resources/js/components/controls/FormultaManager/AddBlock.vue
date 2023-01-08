<script setup>
import BlockBase from "./BlockBase.vue";
import useBlock from "./useBlock";
import PlusIcon from "~icons/fa-solid/plus";

const props = defineProps({
    block: {
        type: Object,
        required: true,
    },
});

const emit = defineEmits(["change", "add", "remove"]);

const { onAddItem } = useBlock(props, emit);
</script>

<template>
    <BlockBase :block="block" :clickable="false">
        <template #label>
            <div>&nbsp;</div>
        </template>
        <template #toggle>
            <button
                class="btn btn-sm bg-sky-500 hover:bg-sky-700"
                @click.prevent="onAddItem"
            >
                <PlusIcon />
            </button>
        </template>
    </BlockBase>
</template>

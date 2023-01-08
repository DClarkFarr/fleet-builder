<script setup>
import BlockBase from "./BlockBase.vue";
import useBlock from "./useBlock";

const props = defineProps({
    block: {
        type: Object,
        required: true,
    },
});

const emit = defineEmits(["change", "add", "remove"]);

const { itemTypes, onChangeType } = useBlock(props, emit);
</script>

<template>
    <BlockBase :block="block">
        <template #label>
            <div>Formula</div>
        </template>
        <template #toggle>
            <span> ( </span>
        </template>
        <template #pane>
            <div>
                <VSelect
                    label="name"
                    :options="itemTypes"
                    :reduce="(o) => o.slug"
                    :clearable="false"
                    v-model="block.item.type"
                    @close="onChangeType"
                />
            </div>
        </template>
    </BlockBase>
</template>

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

const { operators, onChangeOperator } = useBlock(props, emit);
</script>

<template>
    <BlockBase :block="block">
        <template #label>
            <div>Operator</div>
        </template>
        <template #toggle>
            <span> {{ block.item.operator }} </span>
        </template>
        <template #pane>
            <div>
                <VSelect
                    label="name"
                    :options="operators"
                    :reduce="(option) => option.slug"
                    :clearable="false"
                    v-model="block.item.operator"
                    @close="onChangeOperator"
                />
            </div>
        </template>
    </BlockBase>
</template>

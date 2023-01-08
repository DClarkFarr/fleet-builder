<script setup>
import { computed, ref } from "vue";
import DataService from "../../../services/DataService";
import BlockBase from "./BlockBase.vue";
import useBlock from "./useBlock";

import TraskIcon from "~icons/fa-solid/trash-alt";

const shipColumns = DataService.getShipColumns();

const props = defineProps({
    block: {
        type: Object,
        required: true,
    },
});

const emit = defineEmits(["change", "add", "remove"]);

const {
    itemTypes,
    columns,
    onChangeType,
    isColumn,
    onChangeColumn,
    onChangeNumber,
    onRemove,
} = useBlock(props, emit);

const showDelete = ref(false);

const toggleShowDelete = () => {
    showDelete.value = !showDelete.value;
};

const computedText = computed(() => {
    if (isColumn(props.block.item.type)) {
        return shipColumns.find((c) => c.slug === props.block.item.value).name;
    }

    return props.block.item.value;
});
</script>

<template>
    <BlockBase :block="block">
        <template #label>
            <div class="flex gap-x-2">
                <div
                    class="cursor-pointer underline"
                    @click="toggleShowDelete"
                    v-tooltip="'Click to show Delete option'"
                >
                    Value
                </div>
                <div
                    class="cursor-pointer text-red-600 hover:text-red-600 underline"
                    @click="onRemove"
                    v-if="showDelete"
                >
                    <TraskIcon />
                </div>
            </div>
        </template>
        <template #toggle>
            <span> {{ computedText }} </span>
        </template>
        <template #pane>
            <div>
                <div class="form-group">
                    <VSelect
                        label="name"
                        :options="itemTypes"
                        :reduce="(o) => o.slug"
                        :clearable="false"
                        v-model="block.item.type"
                        @close="onChangeType"
                    />
                </div>

                <div class="form-group">
                    <template v-if="isColumn(block.item.type)">
                        <VSelect
                            label="name"
                            :options="columns"
                            :reduce="(option) => option.slug"
                            :clearable="false"
                            v-model="block.item.value"
                            @close="onChangeColumn(index)"
                        />
                    </template>
                    <template v-else>
                        <input
                            class="form-control"
                            type="number"
                            step=".1"
                            :value="block.item.value"
                            @input="(e) => onChangeNumber(e)"
                        />
                    </template>
                </div>
            </div>
        </template>
    </BlockBase>
</template>

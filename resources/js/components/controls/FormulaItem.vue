<script setup>
import { computed, ref, reactive, onMounted, toRaw } from "vue";
import DataService from "../../services/DataService";

import PlusIcon from "~icons/fa-solid/plus";

const columns = DataService.getShipColumns();
const itemTypes = DataService.getFormulaItemTypes();
const operators = DataService.getFormulaOperators();
/*
    items: {
        type: 'column', 'number', 'formula'
        value: '',
        operator: '',
        children: [],
    }
    */
const props = defineProps({
    depth: {
        type: Number,
        default: 0,
    },
    items: {
        type: Array,
        default: () => [],
    },
});

const emit = defineEmits(["change"]);

const isFormula = (type) => {
    return type === DataService.FORMULA_ITEM_TYPES.FORMULA;
};
const isColumn = (type) => {
    return type === DataService.FORMULA_ITEM_TYPES.COLUMN;
};

const isLast = (index) => {
    return index === props.items.length - 1;
};

const onChange = (items) => {
    const raw = items.map((i) => toRaw(i));
    console.log("bumping", raw);
    emit("change", raw);
};
const onChangeColumn = (index) => {
    const items = [...props.items];
    onChange(items);
};

const onChangeNumber = (index, e) => {
    const items = [...props.items];
    items[index].value = parseInt(e.target.value) || 0;
    onChange(items);
};

const onChangeOperator = (index) => {
    const items = [...props.items];

    console.log("operator pushing", items[index].operator);
    onChange(items);
};

const onChangeFormula = (index, data) => {
    const items = [...props.items];
    items[index].children = data;

    onChange(items);
};

const onChangeType = (index) => {
    const item = props.items[index];
    if (
        item.type === DataService.FORMULA_ITEM_TYPES.COLUMN &&
        !isNaN(parseInt(item.value))
    ) {
        item.value = DataService.SHIP_COLUMNS.LEVEL;
    } else if (
        item.type === DataService.FORMULA_ITEM_TYPES.NUMBER &&
        isNaN(parseInt(item.value))
    ) {
        item.value = 1000;
    }
};

const onAddItem = () => {
    const items = [...props.items];
    items.push({
        type: DataService.FORMULA_ITEM_TYPES.NUMBER,
        value: 1000,
        operator: DataService.FORMULA_ITEM_OPERATORS.MULTIPLY,
        children: [],
    });
    onChange(items);
};

const colorClasses = ["slate", "blue", "emerald", "indigo", "green"];

const depthClass = computed(
    () => colorClasses[props.depth % colorClasses.length]
);

onMounted(() => {
    if (!props.items.length) {
        emit("change", [
            {
                type: DataService.FORMULA_ITEM_TYPES.NUMBER,
                value: 1000,
                operator: DataService.FORMULA_ITEM_OPERATORS.MULTIPLY,
                children: [],
            },
            {
                type: DataService.FORMULA_ITEM_TYPES.COLUMN,
                value: DataService.SHIP_COLUMNS.LEVEL,
                operator: DataService.FORMULA_ITEM_OPERATORS.MULTIPLY,
                children: [],
            },
        ]);
    }
});
</script>

<template>
    <div
        class="formula-item flex flex-wrap gap-1 px-2 border-l-2"
        :class="[`formula-item--${depthClass}`]"
    >
        <div
            class="item"
            v-for="(item, index) in items"
            :key="`${items.length}-${index}`"
        >
            <div class="item__type">
                <VSelect
                    label="name"
                    :options="itemTypes"
                    :reduce="(o) => o.slug"
                    :clearable="false"
                    v-model="item.type"
                    @close="onChangeType(index)"
                />
            </div>
            <div class="item__value">
                <template v-if="isFormula(item.type)">
                    <div class="wrapper">
                        <FormulaItem
                            :depth="depth + 1"
                            :items="item.children"
                            @change="(data) => onChangeFormula(index, data)"
                        />
                    </div>
                </template>
                <template v-else-if="isColumn(item.type)">
                    <VSelect
                        label="name"
                        :options="columns"
                        :reduce="(option) => option.slug"
                        :clearable="false"
                        v-model="item.value"
                        @close="onChangeColumn(index)"
                    />
                </template>
                <template v-else>
                    <input
                        class="form-control w-20"
                        type="number"
                        step=".1"
                        :value="item.value"
                        @input="(e) => onChangeNumber(index, e)"
                    />
                </template>
            </div>
            <div class="item__operator" v-if="!isLast(index)">
                <VSelect
                    label="name"
                    :options="operators"
                    :reduce="(option) => option.slug"
                    :clearable="false"
                    v-model="item.operator"
                    @close="onChangeOperator(index)"
                />
            </div>
        </div>

        <div class="item item--add">
            <button
                class="btn btn-sm bg-sky-500 hover:bg-sky-700"
                @click.prevent="onAddItem"
            >
                <PlusIcon />
            </button>
        </div>
    </div>
</template>

<style lang="less">
.formula-item {
    &--slate {
        @apply border-slate-500 bg-slate-100;
    }
    &--blue {
        @apply border-blue-500 bg-blue-100;
    }
    &--emerald {
        @apply border-emerald-500 bg-emerald-100;
    }
    &--green {
        @apply border-green-500 bg-green-100;
    }
    &--indigo {
        @apply border-indigo-500 bg-indigo-100;
    }
}
</style>

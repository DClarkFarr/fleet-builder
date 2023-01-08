<script setup>
import { computed, ref, reactive, onMounted, toRaw } from "vue";
import { onClickOutside } from "@vueuse/core";
import DataService from "../../services/DataService";
import useBlock from "./FormultaManager/useBlock";

import { setActivePath } from "./FormultaManager/useBlockState";

import AddBlock from "./FormultaManager/AddBlock.vue";
import CloseBlock from "./FormultaManager/CloseBlock.vue";
import ItemBlock from "./FormultaManager/ItemBlock.vue";
import OpenBlock from "./FormultaManager/OpenBlock.vue";
import OperatorBlock from "./FormultaManager/OperatorBlock.vue";

/*
items: {
    type: 'column', 'number', 'formula'
    value: '',
    operator: '',
    children: [],
}
*/
const props = defineProps({
    items: {
        type: Array,
        default: () => [],
    },
});

const emit = defineEmits(["change"]);

const { isFormula, isLast } = useBlock();

const wrapperEl = ref(null);

onClickOutside(wrapperEl, () => {
    setActivePath("");
});

const getComponent = (type) => {
    switch (type) {
        case "add":
            return AddBlock;
        case "close":
            return CloseBlock;
        case "item":
            return ItemBlock;
        case "open":
            return OpenBlock;
        case "operator":
            return OperatorBlock;
    }
};

const buildItemBlocks = (items, bs, depth = []) => {
    items.forEach((item, index) => {
        if (isFormula(item.type)) {
            bs.push({
                depth: [...depth, index],
                index: bs.length,
                type: "open",
                item,
            });
            buildItemBlocks(item.children, bs, [...depth, index]);
            bs.push({
                depth: [...depth, index],
                index: bs.length,
                type: "close",
                item,
            });
        } else {
            bs.push({
                depth: [...depth, index],
                index: bs.length,
                type: "item",
                item,
            });
        }

        if (!isLast(index, items)) {
            bs.push({
                depth: [...depth, index],
                index: bs.length,
                item,
                type: "operator",
            });
        }
    });

    bs.push({
        type: "add",
        depth: [...depth],
        index: bs.length,
    });
};

const onChange = (items) => {
    const raw = items.map((i) => toRaw(i));
    emit("change", raw);
};

const handleBlockAdd = (depthPath, toAdd) => {
    const items = [...props.items];

    if (depthPath.length) {
        let base = items;
        for (let i = 0; i < depthPath.length; i++) {
            const index = depthPath[i];
            base = base[index].children;
        }
        base.push(toAdd);
    } else {
        items.push(toAdd);
    }

    onChange(items);
};

const handleBlockChange = (origDepthPath, data) => {
    console.log("handle block change", origDepthPath, data);
    const depthPath = [...origDepthPath];
    const index = depthPath.pop();

    const items = [...props.items];

    let base = items;
    for (let i = 0; i < depthPath.length; i++) {
        const index = depthPath[i];
        base = base[index].children;
    }

    base[index] = data;

    onChange(items);
};
const onRemove = (origDepthPath) => {
    const depthPath = [...origDepthPath];
    const items = [...props.items];

    const index = depthPath.pop();

    let base = items;
    for (let i = 0; i < depthPath.length; i++) {
        const index = depthPath[i];
        base = base[index].children;
    }

    base.splice(index, 1);

    onChange(items);
};

const blocks = computed(() => {
    const bs = [];

    buildItemBlocks(props.items, bs);

    return bs;
});

onMounted(() => {
    if (!props.items.length) {
        onChange([
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
        class="formula-item flex flex-wrap gap-y-2 gap-x-1 px-2"
        ref="wrapperEl"
    >
        <div
            class="item-wrapper"
            v-for="(block, index) in blocks"
            :key="`${index}`"
        >
            <component
                :is="getComponent(block.type)"
                :block="block"
                @change="handleBlockChange"
                @add="handleBlockAdd"
                @remove="onRemove"
            />
        </div>
    </div>
</template>

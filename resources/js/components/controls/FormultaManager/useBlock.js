import { ref, computed, toRaw, reactive, readonly } from "vue";
import DataService from "../../../services/DataService";
import { sum } from "lodash";
/**
 * Should have props.block
 *
 * Block {
 *  type: open | close | item | operator | add
 *  item: Item {
 *     type: 'column', 'number', 'formula'
 *     value: '',
 *     operator: '',
 *     children: Item[],
 *  }
 *  depth: number[]
 *  index: number;
 * }
 */

import { blockState, setActivePath } from "./useBlockState";

const useBlock = (props, emit) => {
    const columns = DataService.getShipColumns();
    const itemTypes = DataService.getFormulaItemTypes();
    const operators = DataService.getFormulaOperators();

    const isFormula = (type) => {
        return type === DataService.FORMULA_ITEM_TYPES.FORMULA;
    };
    const isColumn = (type) => {
        return type === DataService.FORMULA_ITEM_TYPES.COLUMN;
    };

    const isLast = (index, items) => {
        return index === items.length - 1;
    };

    const onChange = (depth, item) => {
        const raw = toRaw(item);
        emit("change", depth, raw);
    };
    const onChangeColumn = () => {
        onChange(props.block.depth, props.block.item);
    };

    const onChangeNumber = (e) => {
        const item = props.block.item;
        item.value = parseInt(e.target.value) || 0;
        onChange(props.block.depth, item);
    };

    const onChangeOperator = () => {
        const item = props.block.item;
        onChange(props.block.depth, item);
    };

    const onChangeFormula = (data) => {
        const item = props.block.item;
        item.children = data;

        onChange(props.block.depth, item);
    };

    const onChangeType = () => {
        const item = props.block.item;

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

        onChange(props.block.depth, item);
    };

    const onAddItem = () => {
        emit("add", props.block.depth, {
            type: DataService.FORMULA_ITEM_TYPES.NUMBER,
            value: 1000,
            operator: DataService.FORMULA_ITEM_OPERATORS.MULTIPLY,
            children: [],
        });
    };

    const colorClasses = ["slate", "blue", "emerald", "indigo", "green"];

    const depthCount = computed(() => {
        return sum(props.block.depth.map((d) => d + 1));
    });

    const depthColor = computed(
        () => colorClasses[depthCount.value % colorClasses.length]
    );

    const blockToPath = (block) => {
        return block.depth.join(".");
    };
    const openBlock = () => {
        setActivePath(props.block.index);
    };
    const closeBlock = () => {
        setActivePath("");
    };

    const onRemove = () => {
        emit("remove", props.block.depth);
    };

    const isOpen = computed(() => {
        return blockState.activePath === props.block.index;
    });

    return {
        blockState,
        isOpen,
        columns,
        itemTypes,
        operators,
        colorClasses,
        depthColor,
        openBlock,
        closeBlock,
        blockToPath,
        isFormula,
        isColumn,
        isLast,
        onChange,
        onChangeColumn,
        onChangeNumber,
        onChangeOperator,
        onChangeFormula,
        onChangeType,
        onAddItem,
        onRemove,
    };
};

export default useBlock;

<script setup>
import { reactive, ref, computed, watch, onMounted, toRaw } from "vue";
import DataService from "../../services/DataService";
import InputError from "../controls/InputError.vue";

import TrashIcon from "~icons/fa-solid/trash-alt";
import FormulaManager from "../controls/FormulaManager.vue";

const amountTypes = DataService.getAmountTypes();

const props = defineProps({
    index: {
        type: Number,
        required: true,
    },
    amount: {
        type: Object,
        required: true,
    },
});

const emit = defineEmits(["change", "remove"]);

const makeFormObj = () => {
    return {
        type: props.amount?.type || DataService.AMOUNT_TYPES.PERCENT,
        value: props.amount?.value || "8",
        children: props.amount?.children || [],
    };
};

const form = reactive(makeFormObj());

const errors = reactive({
    type: "",
    value: "",
    children: "",
});

const dirty = reactive({
    type: false,
    value: false,
    children: false,
});

const errorMessage = ref("");
const isValid = ref(false);

const validateItem = (item) => {
    if (item.type === DataService.FORMULA_ITEM_TYPES.COLUMN) {
        if (!item.value) {
            errors.children = "Please select a column";
        }
    } else if (item.type === DataService.FORMULA_ITEM_TYPES.NUMBER) {
        if (isNaN(parseInt(item.value)) || item.value < 0) {
            errors.children = "Please enter a valid number";
        }
    } else if (item.type === DataService.FORMULA_ITEM_TYPES.FORMULA) {
        if (!item.children.length) {
            errors.children = "Please add at least one item";
        } else {
            item.children.forEach((item) => {
                validateItem(item);
            });
        }
    }
};

const validateForuma = () => {
    if (!form.children.length) {
        errors.children = "Please add at least one item";
        return;
    }

    form.children.forEach(validateItem);
};

const resetErrors = () => {
    Object.assign(errors, {
        type: "",
        value: "",
        children: "",
    });
};
const validate = () => {
    resetErrors();

    if (isFormula.value) {
        validateForuma();
    } else {
        if (!form.type) {
            errors.type = "Please select an amount type";
        }

        if (isNaN(parseInt(form.value)) || form.value < 0) {
            errors.value = "Please enter a valid amount";
        }
    }

    isValid.value = !Object.values(errors).some((error) => error);
};

const handleChange = (field) => {
    dirty[field] = true;

    validate();

    console.log(
        "handle change",
        [...form.children],
        "=",
        isValid.value,
        "and",
        toRaw(form)
    );
    if (isValid.value) {
        emit("change", toRaw(form));
    }
};

const handleFormulaChange = (updatedItems) => {
    console.log("got update items", [...updatedItems]);
    form.children = updatedItems;

    handleChange("children");
};

const isFormula = computed(() => {
    return form.type === DataService.AMOUNT_TYPES.FORMULA;
});

const amountInput = computed(() => {
    let placeholder = "";
    let type = "number";

    if (form.type === "percent") {
        placeholder = "Percent value: 10 = 10%";
    } else if (form.type === "number") {
        placeholder = "Numeric value";
    } else if (form.type === "seconds") {
        placeholder = "Seconds value: 10 = 10s";
    } else if (form.type === "attacks") {
        placeholder = "Attack cycle: 10 = every 10 attacks";
    }

    return {
        placeholder,
        type,
    };
});

watch(
    () => props.amount,
    () => {
        Object.assign(form, makeFormObj());

        validate();
    }
);

onMounted(() => {
    Object.assign(form, makeFormObj());

    validate();

    if (!props.ability?.type && isValid.value) {
        emit("change", toRaw(form));
    }
});
</script>

<template>
    <div class="amount-form border-slate-300 border-l-4 pl-4 mb-2 relative">
        <div class="flex items-center gap-x-4">
            <div>
                <label class="font-bold text-blue-800 text-xs"
                    >Amount {{ index + 1 }}</label
                >
            </div>
            <div>
                <a
                    href="#"
                    class="text-red-500 hover:text-red-700 text-xs"
                    @click.prevent="emit('remove', index)"
                >
                    <TrashIcon class="h-3 w-3" />
                </a>
            </div>
        </div>
        <div class="lg:flex gap-x-2">
            <div class="lg:w-1/4">
                <div class="mb-3">
                    <label>Amount Type</label>
                    <VSelect
                        label="name"
                        :options="amountTypes"
                        :reduce="(type) => type.slug"
                        :multiple="false"
                        :searchable="true"
                        :clearable="false"
                        v-model="form.type"
                        @input="handleChange('type')"
                        @close="handleChange('type')"
                    />
                    <InputError :error="errors.type" :dirty="dirty.type" />
                </div>
            </div>
            <div class="lg:w-3/4">
                <template v-if="isFormula">
                    <FormulaManager
                        :items="amount.children"
                        @change="handleFormulaChange"
                    />
                    <InputError
                        :error="errors.children"
                        :dirty="dirty.children"
                    />
                </template>
                <template v-else>
                    <div class="mb-3">
                        <label>Amount</label>
                        <input
                            :type="amountInput.type"
                            :placeholder="amountInput.placeholder"
                            class="form-control"
                            step=".1"
                            v-model="form.value"
                            @input="handleChange('value')"
                        />
                        <InputError
                            :error="errors.value"
                            :dirty="dirty.value"
                        />
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

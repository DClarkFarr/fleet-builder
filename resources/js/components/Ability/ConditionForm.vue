<script setup>
import { reactive, watch, ref } from "vue";
import DataService from "../../services/DataService";
import TrashIcon from "~icons/fa-solid/trash-alt";
import InputError from "../controls/InputError.vue";

const conditionTypeOptions = DataService.getConditionTypes();
const conditionTypes = DataService.CONDITION_TYPES;
const operatorOptions = DataService.getOperators();

const props = defineProps({
    condition: {
        type: Object,
        required: true,
    },
    shipClasses: {
        type: Array,
        required: true,
    },
});

const emit = defineEmits(["change", "remove"]);

const form = reactive({
    type: "",
    select: "",
    operator: "",
    value: "",
});

const isValid = ref(false);
const isChanged = ref(false);
const errorMessage = ref("");

const onChange = () => {
    validate();

    if (isValid.value) {
        emit("change", { ...form });

        isChanged.value = true;
        setTimeout(() => {
            isChanged.value = false;
        }, 1500);
    }
};

const validate = () => {
    if (!form.type) {
        isValid.value = false;
        errorMessage.value = "Please select a condition type";
        return;
    }

    if (form.type === conditionTypes.id_class && !form.select.length) {
        isValid.value = false;
        errorMessage.value = "Please select 1 or more ship classes";
        return;
    }

    if (!form.operator) {
        isValid.value = false;
        errorMessage.value = "Please select an operator";
        return;
    }

    if (isNaN(parseInt(form.value)) || form.value < 0) {
        isValid.value = false;
        errorMessage.value = "Please enter a value";
        return;
    }

    isValid.value = true;
    errorMessage.value = "";
};

const onSelectType = (type) => {
    form.type = type;

    setDataByType({ ...form });

    onChange();
};

const onClickRemove = () => {
    emit("remove");
};

const setDataByType = (current = {}) => {
    let defaultSelect = "";
    if (form.type === conditionTypes.id_class) {
        defaultSelect = [];
    }

    form.select =
        current.select && typeof current.select === typeof defaultSelect
            ? current.select
            : defaultSelect;
    form.operator = current.operator || DataService.OPERATORS.GREATER;
    form.value = current.value || "";
};

watch(
    () => props.condition,
    (condition) => {
        form.type = condition.type || conditionTypeOptions[0].slug;

        setDataByType(props.condition);
        validate();
    },
    { immediate: true }
);
</script>

<template>
    <div
        class="condition-form p-2"
        :class="{
            'bg-red-100': !isValid,
            'bg-green-100': isChanged,
        }"
    >
        <div class="condition-group flex gap-x-4">
            <div class="min-w-[130px]">
                <label class="overflow-nowrap">Condition type</label>
                <VSelect
                    label="name"
                    :reduce="(type) => type.slug"
                    :options="conditionTypeOptions"
                    :clearable="false"
                    v-model="form.type"
                    @input="onSelectType()"
                />
            </div>
            <div v-if="form.type">
                <div class="flex gap-x-2">
                    <div>
                        <template v-if="form.type === conditionTypes.id_class">
                            <div>
                                <label># Ships</label>
                                <VSelect
                                    label="name"
                                    :options="shipClasses"
                                    :reduce="(shipClass) => shipClass.id_class"
                                    :multiple="true"
                                    :clearable="true"
                                    :searchable="true"
                                    v-model="form.select"
                                    @input="() => onChange()"
                                    @close="() => onChange()"
                                />
                            </div>
                        </template>
                        <template v-else>
                            type not implemented: <b>{{ form.type }}</b>
                        </template>
                    </div>
                    <div>
                        <label>Operator</label>
                        <VSelect
                            label="name"
                            :options="operatorOptions"
                            :reduce="(operator) => operator.slug"
                            :clearable="false"
                            :searchable="true"
                            v-model="form.operator"
                            @input="() => onChange()"
                            @close="() => onChange()"
                        />
                    </div>
                    <div class="max-w-[120px]">
                        <label>Value</label>
                        <input
                            type="number"
                            class="form-control"
                            v-model="form.value"
                            @input="() => onChange()"
                        />
                    </div>
                </div>
            </div>
            <div class="self-end pb-2">
                <a
                    href="#"
                    class="text-red-500 hover:text-red-700 hover:underline"
                    @click="onClickRemove"
                >
                    <TrashIcon />
                </a>
            </div>
        </div>

        <InputError :error="errorMessage" />
    </div>
</template>

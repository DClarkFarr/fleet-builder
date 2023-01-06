<script setup>
import { reactive, computed, watch, ref, onMounted } from "vue";
import CircleNotchIcon from "~icons/fa-solid/circle-notch";
import InputError from "../controls/InputError.vue";

const props = defineProps({
    slots: {
        type: Array,
        default: () => [],
    },
    label: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    sizes: {
        type: Array,
        required: true,
    },
    onSave: {
        type: Function,
        required: true,
    },
});

const isSaving = ref(false);
const errorMessage = ref("");

const generateDefaultObject = () => {
    return props.sizes.reduce((obj, key) => {
        obj[key] = 0;
        return obj;
    }, {});
};

const generateSlotsObject = () => {
    return props.slots.reduce((obj, slot) => {
        if (!obj[slot.size]) {
            obj[slot.size] = 0;
        }

        obj[slot.size] += slot.amount;

        return obj;
    }, {});
};

const getFormState = () => {
    return {
        ...generateDefaultObject(),
        ...generateSlotsObject(),
    };
};

const form = reactive(getFormState());

const isValid = computed(() => {
    return Object.values(form).every((value) => !isNaN(value) && value >= 0);
});

const onSave = async () => {
    if (isSaving.value || !isValid.value) {
        return;
    }
    isSaving.value = true;

    errorMessage.value = "";

    try {
        await props.onSave(props.type, { ...form });
    } catch (err) {
        errorMessage.value = err.message;
    }

    isSaving.value = false;
};

watch([() => props.slots, () => props.sizes], () => {
    Object.assign(form, getFormState());
});
</script>

<template>
    <div class="slots-form">
        <div
            class="flex gap-x-4 items-center border border-slate-400 p-2 rounded-lg"
        >
            <div class="slots-form__label shrink min-w-[120px]">
                <label class="text-sm font-medium text-slate-600">{{
                    props.label
                }}</label>
            </div>
            <div
                class="slots-form__fields grow justify-end flex gap-x-4 items-center"
                :class="[`grid-cols-${props.sizes.length}`]"
            >
                <div
                    v-for="size in props.sizes"
                    :key="size"
                    class="flex gap-x-2 items-center"
                >
                    <label>{{ size.toUpperCase() }}</label>
                    <input
                        type="number"
                        class="form-control max-w-[80px]"
                        min="0"
                        v-model="form[size]"
                    />
                </div>
            </div>
            <div class="slots-form__actions shrink self-end">
                <button
                    class="btn bg-sky-600 hover:bg-sky-800"
                    :disabled="!isValid || isSaving"
                    @click="onSave"
                >
                    <template v-if="isSaving">
                        <CircleNotchIcon class="animate-spin" />
                    </template>
                    <template v-else> Save </template>
                </button>
            </div>
        </div>
        <InputError :error="errorMessage" />
    </div>
</template>

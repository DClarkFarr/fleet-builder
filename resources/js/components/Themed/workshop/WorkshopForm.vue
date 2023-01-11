<script setup>
import { ref, reactive, computed, watch, onMounted } from "vue";
import { useToast } from "vue-toastification";

import InputError from "../../controls/InputError.vue";

const props = defineProps({
    workshop: {
        type: Object,
        default: null,
    },
    onSave: {
        type: Function,
        required: true,
    },
});

const toast = useToast();

const form = reactive({
    name: "",
    arcade: true,
});

const errors = reactive({
    name: "",
});

const dirty = reactive({
    name: false,
});

const isSubmitting = ref(false);

const isValidForm = ref(false);

const validate = () => {
    errors.name = form.name ? "" : "Name is required";

    return !Object.values(errors).some((err) => err);
};

const onSubmit = async () => {
    isSubmitting.value = true;
    if (isValidForm.value) {
        try {
            await props.onSave(form);
        } catch (err) {
            toast.error(err.message);
        }
    }
    isSubmitting.value = false;
};

watch(form, () => {
    isValidForm.value = validate();
});

onMounted(() => {
    if (props.workshop) {
        form.name = props.workshop.name;
        form.arcade = props.workshop.arcade;
    }
});
</script>

<template>
    <form action="" @submit.prevent="onSubmit">
        <div class="create-workshop">
            <h2 class="text-xl text-modal-title font-medium mb-2">
                Create Workshop
            </h2>
            <p class="text-white mb-4">Select your Workshop type</p>

            <div class="lg:flex gap-x-4 mb-4">
                <div
                    class="p-4 bordered lg:w-1/2 text-center"
                    :class="{ 'bordered--selected': form.arcade }"
                    @click="form.arcade = true"
                >
                    <h2 class="text-white text-xl mb-4">Arcade Workshop</h2>
                    <p class="text-dark-text-white">
                        Create with no restrictions! Use your same ship as many
                        times as you want.
                    </p>
                </div>
                <div
                    class="p-4 bordered lg:w-1/2"
                    :class="{ 'bordered--selected': !form.arcade }"
                    @click="form.arcade = false"
                >
                    <h2 class="text-white text-xl mb-4">Simulation Workshop</h2>
                    <p class="text-dark-text-white">
                        More realistic. You can only use each of the ships in
                        your fleet one time.
                    </p>
                </div>
            </div>
            <div class="form-group">
                <input
                    class="input"
                    type="text"
                    placeholder="Fleet name"
                    v-model="form.name"
                />
                <InputError :error="errors.name" :dirty="dirty.name" />
            </div>
            <div class="form-group">
                <button class="btn btn-blue" :disabled="!isValidForm">
                    Create Workshop
                </button>
            </div>
        </div>
    </form>
</template>

<style lang="less" scoped>
.bordered {
    @apply border-2 rounded border-dark-border-end cursor-pointer;

    background: rgba(77, 104, 127, 0.5);

    box-shadow: 0 0 2px 0 #517090;

    &--selected {
        @apply border-blue-500;
    }
}
</style>

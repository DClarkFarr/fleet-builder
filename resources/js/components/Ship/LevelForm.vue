<script setup>
import { reactive, ref, watch, computed } from "vue";
import CircleNotchIcon from "~icons/fa-solid/circle-notch";
import TrashIcon from "~icons/fa-solid/trash";

const emit = defineEmits(["submit", "delete"]);

const props = defineProps({
    shipLevel: {
        type: Object,
        default: null,
    },
    nextSort: {
        type: Number,
        default: 0,
    },
});

const form = reactive({
    name: props.shipLevel?.name || "",
    sort: props.shipLevel?.sort || props.nextSort,
});

const isSubmitting = ref(false);
const errorMessage = ref("");
const isDirty = ref(false);

const isValid = computed(() => {
    errorMessage.value = "";

    if (form.name.length < 3) {
        errorMessage.value = "Name must be at least 3 characters";
        return false;
    }

    if (isNaN(form.sort)) {
        errorMessage.value = "Sort must be a number";
        return false;
    }

    return true;
});

const onSubmit = async () => {
    if (!isValid.value) {
        return;
    }

    isSubmitting.value = true;
    errorMessage.value = "";

    const resolve = () => {
        isSubmitting.value = false;
        reset();
    };

    const reject = (message) => {
        isSubmitting.value = false;
        errorMessage.value = message;
    };

    emit("submit", { ...form }, resolve, reject);
};

const onDelete = () => {
    isSubmitting.value = true;
    errorMessage.value = "";

    const resolve = () => {
        isSubmitting.value = false;
        reset();
    };

    const reject = (message) => {
        isSubmitting.value = false;
        errorMessage.value = message;
    };

    emit("delete", { ...form }, resolve, reject);
};

const reset = () => {
    form.name = props.shipLevel?.name || "";
    form.sort = props.shipLevel?.sort || props.nextSort;
    isDirty.value = false;
};

const onChangeInput = () => {
    isDirty.value = true;
};

watch(props, () => {
    reset();
});
</script>

<template>
    <form
        action=""
        class="class-form border border-gray-300 rounded p-6"
        @submit.prevent="onSubmit"
    >
        <div class="lg:flex gap-x-4 items-end">
            <div class="form-group">
                <label class="text-sm text-gray-500" for="name">Name</label>
                <input
                    type="text"
                    class="form-control"
                    name="name"
                    placeholder="Standard, Rare, Legendary..."
                    v-model="form.name"
                    @input="onChangeInput"
                />
            </div>
            <div class="form-group">
                <label class="text-sm text-gray-500" for="sort">Sort</label>
                <input
                    type="number"
                    class="form-control"
                    name="sort"
                    v-model="form.sort"
                    @input="onChangeInput"
                />
            </div>
            <div class="form-group flex gap-x-4">
                <div>
                    <button
                        type="submit"
                        class="btn bg-sky-600 hover:bg-sky-800"
                        :disabled="isSubmitting || !isValid"
                    >
                        <template v-if="isSubmitting">
                            <CircleNotchIcon class="animate-spin" />
                        </template>
                        <template v-else> Submit </template>
                    </button>
                </div>

                <div>
                    <button
                        v-if="props.shipLevel"
                        type="button"
                        class="btn bg-red-600 hover:bg-red-800"
                        @click="onDelete"
                        :disabled="isSubmitting"
                    >
                        <template v-if="isSubmitting">
                            <CircleNotchIcon class="animate-spin" />
                        </template>
                        <template v-else>
                            <TrashIcon />
                        </template>
                    </button>
                </div>
            </div>
        </div>
        <div v-if="isDirty && errorMessage" class="mb-4 -mt-2">
            <p class="text-red-600 text-sm">
                {{ errorMessage }}
            </p>
        </div>
    </form>
</template>

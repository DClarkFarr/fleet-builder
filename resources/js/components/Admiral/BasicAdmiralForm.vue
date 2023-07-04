B
<script setup>
import { reactive, ref, onMounted } from "vue";
import InputError from "../controls/InputError.vue";
import CircleNotchIcon from "~icons/fa-solid/circle-notch";

const emit = defineEmits(["submit"]);

const props = defineProps({
    admiral: {
        type: Object,
        default: null,
    },
    isAdmin: {
        type: Boolean,
        default: true,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
});

const isSubmitting = ref(false);
const errorMessage = ref("");
const isValid = ref(false);

const form = reactive({
    name: "",
    public: props.isAdmin,
});

const errors = reactive({
    id_level: "",
    public: "",
});

const dirty = reactive({
    name: false,
    public: false,
});

const resetForm = () => {
    Object.assign(errors, {
        name: "",
        public: "",
    });

    Object.assign(dirty, {
        name: false,
        public: false,
    });

    Object.assign(form, {
        name: "",
        public: props.isAdmin,
    });

    if (props.admiral) {
        Object.assign(form, {
            name: props.admiral.name,
            public: props.admiral.public,
        });
    }
};

const validate = () => {
    Object.assign(errors, {
        name: "",
        public: "",
    });

    if (!form.name) {
        errors.name = "Name is required";
    } else {
        dirty.name = true;
    }

    if (form.name.length < 3) {
        errors.name = "Name must be at least 3 characters";
    }

    isValid.value = !Object.values(errors).some((e) => e);
};

const onSubmit = () => {
    if (!isValid.value) {
        return;
    }

    errorMessage.value = "";

    isSubmitting.value = true;

    const resolve = (reset = true) => {
        if (reset) {
            resetForm();
        }
        isSubmitting.value = false;
    };
    const reject = (message) => {
        if (typeof message === "object") {
            Object.assign(errors, message);
        } else {
            errorMessage.value = message;
        }
        isSubmitting.value = false;
    };

    emit("submit", { ...form }, resolve, reject);
};

const onChangeForm = () => {
    validate();
};

onMounted(async () => {
    resetForm();
    validate();
});
</script>

<template>
    <form action="" class="basic-admiral-form" @submit.prevent="onSubmit">
        <div class="lg:grid grid-cols-2 gap-x-4">
            <div class="form-group">
                <label>admiral Name</label>
                <input
                    type="text"
                    class="form-control"
                    v-model="form.name"
                    @input="onChangeForm"
                    placeholder="Morpheous, Nick, etc"
                    :disabled="disabled"
                />
                <InputError :error="errors.name" :dirty="dirty.name" />
            </div>
            <div class="form-group" v-if="isAdmin">
                <label>Public</label>
                <div class="pt-3">
                    <label>
                        <input
                            type="checkbox"
                            v-model="form.public"
                            @input="onChangeForm"
                            placeholder="Public"
                            :disabled="disabled"
                            :true-value="true"
                            :false-value="false"
                        />

                        {{ form.public ? "Yes" : "No" }}
                    </label>
                </div>
                <InputError :error="errors.public" :dirty="dirty.public" />
            </div>
        </div>
        <div class="form-group" v-if="errorMessage">
            <InputError :error="errorMessage" />
        </div>
        <slot name="button">
            <div class="form-group">
                <button
                    type="submit"
                    class="btn bg-sky-600 hover:bg-sky-800"
                    :disabled="!isValid || isSubmitting || disabled"
                >
                    <template v-if="!isSubmitting"> Submit </template>
                    <template v-else>
                        <CircleNotchIcon class="animate-spin" />
                    </template>
                </button>
            </div>
        </slot>
    </form>
</template>

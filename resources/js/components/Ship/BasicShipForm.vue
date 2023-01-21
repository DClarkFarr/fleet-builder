<script setup>
import { reactive, ref, computed, watch, onMounted, nextTick } from "vue";
import ShipService from "../../services/ShipService";
import InputError from "../controls/InputError.vue";
import CircleNotchIcon from "~icons/fa-solid/circle-notch";
import { isObject } from "@vue/shared";

const emit = defineEmits(["submit"]);

const props = defineProps({
    ship: {
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

const shipClasses = ref([]);
const shipLevels = ref([]);

const form = reactive({
    id_class: "",
    id_level: "",
    name: "",
    energy: 0,
    public: props.isAdmin,
});

const errors = reactive({
    id_level: "",
    id_class: "",
    name: "",
    energy: "",
    public: "",
});

const dirty = reactive({
    id_level: false,
    id_class: false,
    name: false,
    energy: false,
    public: false,
});

const resetForm = () => {
    Object.assign(errors, {
        id_level: "",
        id_class: "",
        name: "",
        energy: "",
        public: "",
    });

    Object.assign(dirty, {
        id_level: false,
        id_class: false,
        name: false,
        energy: false,
        public: false,
    });

    Object.assign(form, {
        id_class: shipClasses.value?.[0]?.id_class || "",
        id_level: shipLevels.value?.[0]?.id_level || "",
        name: "",
        energy: 0,
        public: props.isAdmin,
    });

    if (props.ship) {
        Object.assign(form, {
            id_class: props.ship.id_class,
            id_level: props.ship.id_level,
            name: props.ship.name,
            energy: props.ship.energy,
            public: props.ship.public,
        });
    }
};

const validate = () => {
    Object.assign(errors, {
        id_level: "",
        id_class: "",
        name: "",
        energy: "",
        public: "",
    });

    if (!form.id_level) {
        errors.id_level = "Level is required";
    } else {
        dirty.id_level = true;
    }

    if (!form.id_class) {
        errors.id_class = "Class is required";
    } else {
        dirty.id_class = true;
    }

    if (!form.name) {
        errors.name = "Name is required";
    } else {
        dirty.name = true;
    }

    if (!form.energy) {
        errors.energy = "Energy is required";
    } else {
        dirty.energy = true;
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

const loadClasses = async () => {
    const classes = await ShipService.getShipClasses();
    shipClasses.value = classes;
};

const loadLevels = async () => {
    const levels = await ShipService.getShipLevels();
    shipLevels.value = levels;
};

onMounted(async () => {
    await loadClasses();
    await loadLevels();
    await nextTick();
    resetForm();
    validate();
});
</script>

<template>
    <form action="" class="basic-ship-form" @submit.prevent="onSubmit">
        <div class="form-group">
            <label>Ship Name</label>
            <input
                type="text"
                class="form-control"
                v-model="form.name"
                @input="onChangeForm"
                placeholder="Mechanical, Argo, etc."
                :disabled="disabled"
            />
            <InputError :error="errors.name" :dirty="dirty.name" />
        </div>

        <div class="lg:grid grid-cols-2 gap-x-4">
            <div class="form-group">
                <label>Ship Class</label>
                <VSelect
                    label="name"
                    :options="shipClasses"
                    :reduce="(shipClass) => shipClass.id_class"
                    :multiple="false"
                    :searchable="true"
                    :clearable="false"
                    :disabled="disabled"
                    v-model="form.id_class"
                    @input="onChangeForm"
                />
                <InputError :error="errors.id_class" :dirty="dirty.id_class" />
            </div>
            <div class="form-group">
                <label>Ship Level</label>
                <VSelect
                    label="name"
                    :options="shipLevels"
                    :reduce="(shipLevel) => shipLevel.id_level"
                    :multiple="false"
                    :searchable="true"
                    :clearable="false"
                    :disabled="disabled"
                    v-model="form.id_level"
                    @input="onChangeForm"
                />
                <InputError :error="errors.id_level" :dirty="dirty.id_level" />
            </div>
        </div>
        <div class="lg:grid grid-cols-2 gap-x-4">
            <div class="form-group">
                <label>Energy</label>
                <input
                    type="number"
                    class="form-control"
                    v-model="form.energy"
                    @input="onChangeForm"
                    :disabled="disabled"
                    placeholder="Energy"
                />
                <InputError :error="errors.energy" :dirty="dirty.energy" />
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

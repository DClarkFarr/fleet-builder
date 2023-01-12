<script setup>
import { reactive, toRaw, ref, watch } from "vue";
import InputError from "../../controls/InputError.vue";
import ContentBox from "../ContentBox.vue";

const props = defineProps({
    location: {
        type: Object,
        required: true,
    },
    fleet: {
        type: Object,
        default: null,
    },
    onSave: {
        type: Function,
        required: true,
    },
    onDelete: {
        type: Function,
        required: true,
    },
});

const form = reactive({
    name: "",
    leadership: 0,
});

const errors = reactive({
    name: "",
    leadership: "",
});

const dirty = reactive({
    name: false,
    leadership: false,
});

const isValid = ref(false);
const errorMessage = ref("");
const isSaving = ref(false);

const validate = () => {
    if (!form.name) {
        errors.name = "Name is required";
    } else {
        errors.name = "";
    }

    if (!form.leadership) {
        errors.leadership = "Leadership is required";
    } else {
        errors.leadership = "";
    }

    isValid.value = !Object.values(errors).some((error) => !!error);
};

const onSaveFleet = async () => {
    if (!isValid.value) {
        return;
    }

    isSaving.value = true;

    try {
        await props.onSave(props.location.slug, toRaw(form));
    } catch (error) {
        errorMessage.value = error.message;
    }

    isSaving.value = false;
};

const onClickDelete = async (id_workshop_fleet) => {
    isSaving.value = true;

    try {
        await props.onDelete(id_workshop_fleet);
    } catch (error) {
        errorMessage.value = error.message;
    }

    isSaving.value = false;
};

watch(form, validate, { immediate: true });

watch(
    () => props.fleet,
    (fleet) => {
        if (fleet) {
            form.name = fleet.name;
            form.leadership = fleet.leadership;
        }
    },
    {
        immediate: true,
    }
);
</script>

<template>
    <vue-final-modal
        classes="modal-container"
        content-class="w-full modal-content--lg"
    >
        <ContentBox class="w-full" bg-class="custom-bg">
            <form action="" class="fleet-form" @submit.prevent="onSaveFleet">
                <div class="flex gap-x-3 justify-between">
                    <div>
                        <h1 class="text-2xl modal__title font-medium mb-6">
                            {{ location.name }}
                        </h1>
                    </div>
                    <div v-if="fleet">
                        <button
                            class="btn btn-red btn-sm"
                            type="button"
                            @click="onClickDelete(fleet.id_workshop_fleet)"
                            :disabled="isSaving"
                        >
                            <template v-if="isSaving"> Deleting... </template>
                            <template v-else> Delete </template>
                        </button>
                    </div>
                </div>
                <div class="form-group">
                    <label>Fleet Name</label>
                    <input
                        type="text"
                        class="form-control"
                        v-model="form.name"
                    />

                    <InputError :error="errors.name" :dirty="dirty.name" />
                </div>
                <div class="form-group">
                    <label>Leadership Capacity</label>
                    <input
                        type="text"
                        class="form-control"
                        v-model="form.leadership"
                    />

                    <InputError
                        :error="errors.leadership"
                        :dirty="dirty.leadership"
                    />
                </div>

                <div class="form-group pt-4">
                    <button
                        class="btn btn-blue w-full block"
                        :disabled="!isValid || isSaving"
                        type="submit"
                    >
                        <span v-if="isSaving">Saving...</span>
                        <span v-else>Save</span>
                    </button>
                </div>
            </form>
        </ContentBox>
    </vue-final-modal>
</template>

<style lang="less" scoped></style>

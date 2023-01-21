<script setup>
import { ref, reactive, computed } from "vue";

import ContentBox from "./ContentBox.vue";
import BasicShipForm from "../Ship/BasicShipForm.vue";
import SlotsForm from "../Ship/SlotsForm.vue";
import DataService from "../../services/DataService";
import AbilityItem from "../Ability/AbilityItem.vue";
import { $vfm } from "vue-final-modal";
import { useToast } from "vue-toastification";
import apiClient from "../../services/apiClient";

const sizes = DataService.getSizes();
const slotTypes = DataService.getSlotTypes();

const allLocations = DataService.getShipAbilityLocations();

const abilityLocations = allLocations.filter((l) => !l.isChip);
const chipLocations = allLocations.filter((l) => l.isChip);

const props = defineProps({});

const toast = useToast();

const form = reactive({
    id_class: "",
    id_level: "",
    name: "",
    energy: 0,
    public: false,
});

const slots = reactive({
    weapon: {
        s: 0,
        m: 0,
        l: 0,
    },
    armor: {
        s: 0,
        m: 0,
        l: 0,
    },
    unit: {
        s: 0,
        m: 0,
        l: 0,
    },
});

const isSubmitting = ref(false);

const abilities = ref({});

const formSubmitted = ref(false);

const onSubmitBasic = (data, resolve) => {
    Object.assign(form, data);
    formSubmitted.value = true;
    resolve(false);
};

const onSaveSlots = (type, values) => {
    slots[type] = values;
};

const onSaveAbilities = (location, abs) => {
    if (!abilities.value[location]) {
        abilities.value[location] = [];
    }
    abilities.value[location] = abs;

    $vfm.hide(`ability-modal-${location}`);
};

const onDeleteAbility = (e, location, index) => {
    abilities.value[location].splice(index, 1);
};

const onSubmit = async () => {
    isSubmitting.value = true;

    const data = {
        form: {
            id_class: form.id_class,
            id_level: form.id_level,
            name: form.name,
            energy: form.energy,
        },
        slots,
        abilities: abilities.value,
    };

    try {
        const response = await apiClient.post("data/ships", data);

        toast.success("Ship submitted successfully. Thank you!");

        $vfm.hideAll();
    } catch (err) {
        console.warn("caught error submitting ship", err);
        toast.error(err.response?.data?.message || err.message);
    }

    isSubmitting.value = false;
};
</script>

<template>
    <vue-final-modal
        classes="modal-container submit-ship-modal"
        content-class="w-full modal-content--4xl"
    >
        <ContentBox class="w-full" bg-class="custom-bg text-gray-600">
            <div class="quick-reference">
                <h2 class="text-2xl text-gray-800 font-medium mb-10">
                    Submit Ship
                </h2>
                <div class="mb-8">
                    <h3 class="font-medium text-xl mb-4">Basic Ship Info</h3>
                    <BasicShipForm
                        @submit="onSubmitBasic"
                        :is-admin="false"
                        :disabled="formSubmitted"
                    >
                        <template #button v-if="formSubmitted">
                            <div><!-- empty --></div>
                        </template>
                    </BasicShipForm>
                </div>

                <template v-if="formSubmitted">
                    <hr />

                    <div class="mb-8 mt-8">
                        <h3 class="font-2xl mb-4 font-medium text-xl">
                            Ship Slots
                        </h3>
                        <div class="slots grid gap-1">
                            <SlotsForm
                                v-for="slotType in slotTypes"
                                :key="slotType.slug"
                                :sizes="sizes"
                                :type="slotType.slug"
                                :onSave="onSaveSlots"
                                :label="`${slotType.name} Slots`"
                            />
                        </div>
                    </div>
                    <hr />
                    <div class="my-8">
                        <h3 class="font-2xl mb-4 font-medium text-xl">
                            Ship Abilities
                        </h3>
                        <div class="abilities grid gap-1">
                            <AbilityItem
                                v-for="location in abilityLocations"
                                :key="location.slug"
                                :location="location.slug"
                                :location-name="location.name"
                                :abilities="abilities[location.slug] || []"
                                :onSave="
                                    (abilities) =>
                                        onSaveAbilities(
                                            location.slug,
                                            abilities
                                        )
                                "
                                :onDelete="onDeleteAbility"
                                :stackable="true"
                            />
                        </div>
                    </div>
                    <div class="my-8">
                        <h3 class="font-2xl mb-4 font-medium text-xl">
                            Chip Abilities
                        </h3>
                        <div class="abilities grid gap-1">
                            <AbilityItem
                                v-for="location in chipLocations"
                                :key="location.slug"
                                :location="location.slug"
                                :location-name="location.name"
                                :stackable="true"
                                :abilities="abilities[location.slug] || []"
                                :onSave="
                                    (abilities) =>
                                        onSaveAbilities(
                                            location.slug,
                                            abilities
                                        )
                                "
                                :onDelete="onDeleteAbility"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            class="btn bg-sky-600 hover:bg-sky-800"
                            @click="onSubmit"
                            :disabled="isSubmitting"
                        >
                            {{
                                isSubmitting
                                    ? "Submitting..."
                                    : "Submit For Review"
                            }}
                        </button>
                    </div>
                </template>
            </div>
        </ContentBox>
    </vue-final-modal>
</template>

<style lang="less">
.submit-ship-modal,
.ability-modal {
    .custom-bg {
        background: #fff;
    }

    .modal__content {
        background: #fff;
    }

    .v-select {
        @apply bg-white border border-gray-300;

        .vs__open-indicator,
        .vs__clear {
            fill: #333;
        }

        .vs__dropdown-menu {
            @apply bg-white border border-input-border;
        }

        .vs__selected {
            @apply text-gray-700;
        }
    }
}
</style>

<style lang="less" scoped>
:deep(.v-select) {
    @apply bg-white border border-gray-300;

    .vs__open-indicator,
    .vs__clear {
        fill: #333;
    }

    .vs__dropdown-menu {
        @apply bg-white border border-input-border;
    }

    .vs__selected {
        @apply text-gray-700;
    }
}
</style>

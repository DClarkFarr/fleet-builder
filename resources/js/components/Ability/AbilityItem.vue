<script setup>
import { ref, computed } from "vue";
import { $vfm } from "vue-final-modal";

import EditIcon from "~icons/fa-solid/pencil-alt";
import DataService from "../../services/DataService";
import AbilityForm from "./AbilityForm.vue";

const props = defineProps({
    abilities: {
        type: Array,
        default: () => [],
    },
    location: {
        type: String,
        required: true,
    },
    locationName: {
        type: String,
        required: true,
    },
    onSave: {
        type: Function,
        required: true,
    },
});

const modals = ref({});

const onClickEdit = () => {};

const onClickAdd = async () => {
    await $vfm.hideAll();
    $vfm.show(`${props.location}--add`);
};

const onCreateAbility = (abilityForm) => {
    const abilities = [...props.abilities];
    abilities.push(abilityForm);

    props.onSave(abilities);

    $vfm.hide(`${props.location}--add`);
};

const defaultAbility = computed(() => {
    return {
        amount_type: DataService.AMOUNT_TYPES.PERCENT,
        amount: 8,
    };
});
</script>

<template>
    <div class="item border-l border-l-2 py-2 mb-4 border-slate-700 pl-4">
        <div class="flex">
            <div class="ability__name mb-4 text-lg">
                <div class="text-sm text-gray-500">Location</div>
                {{ locationName }}
            </div>
            <div class="ability__add ml-auto">
                <button
                    class="btn bg-sky-600 hover:bg-sky-800"
                    @click="onClickAdd"
                >
                    Add Ability
                </button>
            </div>
        </div>
        <div class="abilities">
            <div
                class="ability flex border text-sm text-gray-500 bg-gray-200 p-3 rounded gap-x-4 mb-1"
                v-for="ability in abilities"
                :key="ability.id_ability"
            >
                <div class="ml-auto">
                    <button
                        class="btn bg-sky-600 hover:bg-sky-800"
                        @click="onClickEdit"
                    >
                        <EditIcon />
                    </button>
                </div>
            </div>

            <div v-if="!abilities.length">
                <div
                    class="text-gray-500 text-sm bg-gray-200 p-3 rounded text-center"
                >
                    No abilities for this location.
                </div>
            </div>
        </div>

        <vue-final-modal
            v-for="ability in abilities"
            :key="ability.id_ability"
            classes="modal-container"
            content-class="modal-content"
            v-model="modals[ability.id_ability]"
            :name="`${location}--${ability.id_ability}`"
        >
            <span class="modal__title">Hello, vue-final-modal</span>
            <div class="modal__content">
                <p>
                    Vue Final Modal is a renderless, stackable, detachable and
                    lightweight modal component.
                </p>
            </div>
        </vue-final-modal>

        <vue-final-modal
            classes="modal-container"
            content-class="modal-content modal-content--xl"
            v-model="modals.add"
            :modal-visible="true"
            :name="`${location}--add`"
        >
            <div class="modal__content">
                <AbilityForm
                    :ability="defaultAbility"
                    :location="location"
                    :locationName="locationName"
                    :onSave="onCreateAbility"
                />
            </div>
        </vue-final-modal>
    </div>
</template>

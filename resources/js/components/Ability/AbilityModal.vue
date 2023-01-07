<script setup>
import AbilityForm from "./AbilityForm.vue";

const props = defineProps({
    ability: {
        type: Object,
        required: true,
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
</script>

<template>
    <vue-final-modal
        classes="modal-container"
        content-class="modal-content modal-content--xl"
    >
        <div class="modal__content">
            <AbilityForm
                :ability="ability"
                :location="location"
                :locationName="locationName"
                :onSave="onSave"
            />
        </div>
    </vue-final-modal>
</template>

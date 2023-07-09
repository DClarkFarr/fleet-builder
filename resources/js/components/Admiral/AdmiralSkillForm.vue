<script setup>
import AbilityItem from "../Ability/AbilityItem.vue";

const props = defineProps({
    location: {
        type: Object,
    },
    skill: {
        type: Object,
    },
});

const onSaveAbilities = (location, abilities) => {
    console.log("on save ability", location, abilities);
};
const onDeleteAbility = (...xs) => {
    console.log("on delete ability", ...xs);
};
</script>

<template>
    <div class="mb-8 abilities">
        <AbilityItem
            :location="location.slug"
            :location-name="location.name"
            :abilities="skill.abilities"
            :onSave="(abilities) => onSaveAbilities(location.slug, abilities)"
            :onDelete="onDeleteAbility"
        />
    </div>
</template>

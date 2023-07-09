<script setup>
import { computed } from "vue";
import DataService from "../../services/DataService";
import AdmiralSkillsLocation from "./AdmiralSkillsLocation.vue";

const props = defineProps({
    admiral: {
        type: Object,
    },
});

const skillLocations = DataService.getAdmiralSkillLocations();
const emit = defineEmits(["update:admiral"]);

const admiral = computed({
    get: () => props.admiral,
    set: (value) => emit("update:admiral", value),
});

const skillsByLocation = computed(() => {
    const skillKeys = skillLocations.reduce((acc, loc) => {
        acc[loc.slug] = [];

        return acc;
    }, {});

    return admiral.value.skills.reduce((acc, skill) => {
        if (acc[skill.location]) {
            acc[skill.location].push(skill);
        }
        return acc;
    }, skillKeys);
});

const onUpdateSkills = (location, skills) => {
    console.log("updated skills", location, skills);
};
</script>
<template>
    <div class="skill-manager">
        <AdmiralSkillsLocation
            v-for="location in skillLocations"
            :key="location.slug"
            :location="location"
            :admiral="admiral"
            :skills="skillsByLocation[location.slug]"
            @update:skills="onUpdateSkills"
        />
    </div>
</template>

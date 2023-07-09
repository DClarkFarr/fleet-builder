<script setup>
import AdmiralService from "../../services/AdmiralService";
import AbilityItem from "../Ability/AbilityItem.vue";

import AdmiralSkillForm from "./AdmiralSkillForm.vue";

const props = defineProps({
    admiral: {
        type: Object,
    },
    location: {
        type: Object,
    },
    skills: {
        type: Array,
        default: () => [],
    },
});

const emit = defineEmits(["update:skills"]);

const onCreateSkill = () => {
    AdmiralService.createAdmiralSkill(
        props.admiral.id_admiral,
        props.location.slug
    )
        .then((skill) => {
            const skills = [...props.skills];
            skills.push(skill);
            emit("update:skills", props.location.slug, skills);
        })
        .catch((err) => {
            console.log(err);
        });
};
</script>

<template>
    <div class="admiral-skill-form form mb-8">
        <div class="mb-8">
            <div class="flex gap-x-4 items-center">
                <div>
                    <h2 class="text-2xl font-semibold">{{ location.name }}</h2>
                </div>
                <div class="ml-auto">
                    <button
                        class="btn bg-sky-700 hover:bg-sky-800"
                        @click="onCreateSkill"
                    >
                        Add Skill
                    </button>
                </div>
            </div>
        </div>
        <div class="mb-8 skills">
            <AdmiralSkillForm
                class="skill"
                v-for="skill in skills"
                :key="skill.id_skill"
                :location="location"
                :skill="skill"
            ></AdmiralSkillForm>
        </div>
    </div>
</template>

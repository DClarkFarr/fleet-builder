<script setup>
import { computed } from "vue";
import FleetParsedAbilityLine from "./FleetParsedAbilityLine.vue";

const props = defineProps({
    fleet: {
        type: Object,
        required: true,
    },
    parsedAbilities: {
        type: Object,
        required: true,
    },
});
</script>

<template>
    <div class="fleet-ability-lines flex flex-col gap-y-3">
        <FleetParsedAbilityLine
            v-for="parsedFleetAbility in parsedAbilities"
            :parsedFleetAbility="parsedFleetAbility"
            :fleetUserShips="fleet.user_ships"
            :key="parsedFleetAbility.ability.id_ability"
        />
    </div>
</template>

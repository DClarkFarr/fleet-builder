<script setup>
import { computed } from "vue";

import AbilityTag from "../ability/AbilityTag.vue";

import IconCheckCircle from "~icons/fa-solid/check-circle";
import IconTimesCircle from "~icons/fa-solid/times-circle";

const props = defineProps({
    fleetUserShips: {
        type: Array,
        required: true,
    },
    parsedFleetAbility: {
        type: Object,
        required: true,
    },
});

const isApplied = computed(() => {
    if (!props.parsedFleetAbility.hasConditions) {
        return true;
    }

    // must have conditions
    return props.parsedFleetAbility.meetsConditions;
});

const matchedShips = computed(() => {
    const pa = props.parsedFleetAbility;
    const matched = [];

    props.fleetUserShips.forEach((userShip) => {
        if (pa.hasQualifiers) {
            if (pa.ability.for_class_ids.length) {
                if (
                    pa.ability.for_class_ids.includes(
                        userShip.ship.ship_class.id_class
                    )
                ) {
                    matched.push({
                        id_user_ship: userShip.id_user_ship,
                        id_ship: userShip.ship.id_ship,
                        name: userShip.ship.name,
                        nickname: userShip.name,
                        ship_class: userShip.ship.ship_class.name,
                    });
                }
            }
        } else {
            matched.push({
                id_user_ship: userShip.id_user_ship,
                id_ship: userShip.ship.id_ship,
                name: userShip.ship.name,
                nickname: userShip.name,
                ship_class: userShip.ship.ship_class.name,
            });
        }
    });

    return matched;
});
</script>

<template>
    <div
        class="fleet-ability-line ability"
        :class="{
            'ability--applied': isApplied,
        }"
    >
        <div class="flex items-center gap-x-3">
            <div>
                <template v-if="isApplied">
                    <IconCheckCircle class="text-grow-green-text-alt" />
                </template>
                <template v-else>
                    <IconTimesCircle class="text-btn-red-border" />
                </template>
            </div>
            <div>
                <div class="ability__from flex gap-x-2 items-start">
                    <div class="shrink">
                        {{ parsedFleetAbility.source.name }}
                        <div class="text-sm italic pl-2">
                            {{ parsedFleetAbility.source.nickname }}
                        </div>
                    </div>
                    <div class="grow">
                        <AbilityTag :parsedAbility="parsedFleetAbility" />
                    </div>
                </div>
                <div class="ability__matches">
                    <div class="flex gap-x-3 items-start">
                        <div class="text-xs text-modal-text">Applies to:</div>
                        <div>
                            <template
                                v-if="
                                    matchedShips.length ===
                                    fleetUserShips.length
                                "
                            >
                                All ships in fleet
                            </template>
                            <template v-else-if="matchedShips?.length">
                                <div class="flex flex-wrap gap-2">
                                    <div
                                        v-for="(m, index) in matchedShips"
                                        :key="`${m.id_user_ship}-${index}`"
                                    >
                                        {{ m.name }}
                                        <span
                                            class="pl-2 text-white italic text-xs"
                                        >
                                            {{ m.nickname }}
                                        </span>
                                    </div>
                                </div>
                            </template>
                            <template v-else>
                                <div>Applies to no ships</div>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

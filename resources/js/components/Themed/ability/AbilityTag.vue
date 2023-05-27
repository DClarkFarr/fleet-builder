<script setup>
import { computed, toRaw } from "vue";

import IconChip from "~icons/fa-solid/microchip";
import IconFlag from "~icons/fa-solid/flag";
import IconExclamationCircle from "~icons/fa-solid/exclamation-circle";
import IconExclamationTriangle from "~icons/fa-solid/exclamation-triangle";
import IconChevronCircleDown from "~icons/fa-solid/chevron-circle-down";
import IconShareAlt from "~icons/fa-solid/share-alt";

const props = defineProps({
    parsedAbility: {
        type: Object,
        required: true,
    },
});

const Icon = computed(() => {
    if (props.parsedAbility.ability.location.includes("flagship_")) {
        return IconFlag;
    } else if (props.parsedAbility.ability.location.includes("chip_")) {
        return IconChip;
    } else {
        return IconChevronCircleDown;
    }
});
</script>

<template>
    <div
        class="ability-tag flex gap-x-[3px] items-center text-xs leading-none"
        :class="[`ability-tag--${parsedAbility.extra.affectType}`]"
    >
        <div
            class="ability-tag__icon cursor-pointer"
            v-tooltip="parsedAbility.extra.fullDescription"
        >
            <component :is="Icon" />
        </div>
        <div class="ability-tag__text">
            <div class="ability-tag__text__name">
                {{ parsedAbility.extra.abilityTypeCategory }}
                <template v-if="parsedAbility.extra.amountIsFormula">
                    calc(x)
                </template>
                <template v-else>
                    {{ parsedAbility.extra.amount }}
                </template>
            </div>
        </div>
        <div class="ability-tag__badges flex gap-x-[2px] text-xs">
            <div
                v-if="parsedAbility.extra.hasConditions"
                class="cursor-pointer"
                v-tooltip="
                    `Condition: ${parsedAbility.extra.conditionsDescription}`
                "
            >
                <IconExclamationCircle />
            </div>
            <div
                v-if="parsedAbility.extra.hasQualifiers"
                class="cursor-pointer"
                v-tooltip="parsedAbility.extra.abilityQualifiers"
            >
                <IconExclamationTriangle />
            </div>
            <div
                v-if="
                    parsedAbility.ability.applies_to_fleet &&
                    !parsedAbility.ability.location.includes('flagship_')
                "
                class="ability-tag__boost cursor-pointer"
                v-tooltip="'Boosts Fleet'"
            >
                <IconShareAlt />
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.ability-tag {
    padding: 2px;

    &__boost {
        color: #b1ffe8;
        background: rgba(34, 108, 86, 0.5);
        padding: 2px;
        margin: -2px;
    }

    &--attack {
        color: #f7d5d5;
        background: rgba(135, 36, 27, 0.5);
    }
    &--defense {
        color: #a5cbec;
        background: rgba(33, 80, 134, 0.5);
    }
    &--passive {
        color: #f9e4ad;
        background: rgba(176, 137, 46, 0.5);
    }
}
/*
"btn-blue-border": "#587fac",
"btn-blue-bg": "#1e2840",
"btn-blue-text": "#afc8ff",

"btn-bright-blue": "#8ec2f9",

"btn-yellow-border": "#aa9571",
"btn-yellow-bg": "#2a364a",
"btn-yellow-text": "#f9e4ad",

"btn-red-border": "#dd564a",
"btn-red-bg": "#252737",
"btn-red-text": "#ff4746",

*/
</style>

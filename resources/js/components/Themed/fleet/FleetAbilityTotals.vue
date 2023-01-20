<script setup>
import { computed, toRaw } from "vue";

import { cloneDeep } from "lodash";

import { sumFleetTotalStats } from "../../../methods/abilityStatParser";

import { summedStatsTotalToText } from "../../../methods/summedAbilityToText";

import useBuilderStore from "../../../stores/builderStore";

const props = defineProps({
    fleet: {
        type: Object,
        required: true,
    },
    totals: {
        type: Object,
        required: true,
    },
});

const builderStore = useBuilderStore();

const computedTotals = computed(() => {
    const rows = sumFleetTotalStats(
        props.fleet,
        cloneDeep(toRaw(props.totals))
    );

    return rows.map((r) => {
        return {
            ...r,
            ...summedStatsTotalToText(props.fleet, r, {
                shipClasses: builderStore.shipClasses,
            }),
        };
    });
});
</script>

<template>
    <div class="fleet-ability-totals">
        <div v-if="computedTotals?.length" class="grid w-full gap-y-2">
            <div
                class="total-item border-l-4 pl-2 py-1"
                v-for="(total, index) in computedTotals"
                :class="[`total-item--${total.affectType}`]"
                :key="total.slug + index"
            >
                <div
                    class="total-item__header font-bold text-sm text-modal-title mb-1"
                >
                    {{ total.category }} > {{ total.affectTypeName }}
                </div>
                <div class="total-item__description text-xs">
                    {{ total.description }}
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.total-item {
    &--attack {
        @apply border-btn-red-border;
    }

    &--defense {
        @apply border-btn-blue-border;
    }

    &--passive {
        @apply border-btn-yellow-border;
    }
}
</style>

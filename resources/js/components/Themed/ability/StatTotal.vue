<script setup>
import { ref } from "vue";
import IconChip from "~icons/fa-solid/microchip";
import IconFlag from "~icons/fa-solid/flag";
import IconExclamationCircle from "~icons/fa-solid/exclamation-circle";
import IconExclamationTriangle from "~icons/fa-solid/exclamation-triangle";
import IconChevronCircleDown from "~icons/fa-solid/chevron-circle-down";
import IconShareAlt from "~icons/fa-solid/share-alt";
import IconQuestionCircle from "~icons/fa-solid/question-circle";
import DataService from "../../../services/DataService";

const props = defineProps({
    total: {
        type: Object,
        required: true,
    },
});

const opened = ref(false);

const toggleOpened = () => {
    opened.value = !opened.value;
};
/*
var example = {
    type: "increase_armor",
    source: {
        ability: {
            id_ability: 7,
            abilities_id: 9,
            abilities_type: "App\\Models\\Ship",
            location: "ability_2",
            type: "increase_armor",
            variants: [],
            amounts: [{ type: "percent", value: "28", children: [] }],
            weapon_classes: [],
            weapon_sizes: [],
            notes: null,
            duration_type: null,
            duration: null,
            applies_to_fleet: false,
            flagship_required: false,
            for_class_ids: [],
            target_class_ids: [],
            conditions: [],
            created_at: "2023-01-07T05:52:32.000000Z",
            updated_at: "2023-01-09T04:56:52.000000Z",
            repeat_type: null,
            repeat: null,
        },
        id_user_ship: 89,
        slug: "all",
        amounts: [{ type: "percent", value: "28", children: [] }],
    },
    value: 28,
    strength: 1,
    values: [],
    variants: [],
    for_class_ids: [[]],
    target_class_ids: [[]],
    isVariantType: false,
    target: [89],
    amountType: "percent",
    abilityType: "increase_armor",
    slug: "all",
    description: "Increase Armor by 28%",
    category: "Armor",
    affectType: "defense",
    affectTypeName: "Defense",
};
*/
</script>

<template>
    <div class="stat-total-wrap" @click="toggleOpened">
        <div
            class="stat-total text-sm relative border-l-4 leading-none"
            :class="[`stat-total--${total.affectType}`]"
        >
            <div class="flex items-center gap-x-2">
                <div
                    class="stat-total__icons flex gap-x-2"
                    v-if="
                        total.hasConditions ||
                        total.hasQualifiers ||
                        total.appliesToFleet
                    "
                >
                    <div
                        v-if="total.hasConditions"
                        class="cursor-pointer"
                        v-tooltip="
                            `Condition: ${total.source.extra.conditionsDescription}`
                        "
                    >
                        <IconExclamationCircle
                            class="text-sm text-orange-700"
                        />
                    </div>
                    <div
                        v-if="total.hasQualifiers"
                        class="cursor-pointer"
                        v-tooltip="
                            `Qualifier: ${total.source.extra.abilityQualifiers}`
                        "
                    >
                        <IconExclamationTriangle
                            class="text-sm text-orange-900"
                        />
                    </div>
                    <div
                        v-if="total.appliesToFleet"
                        class="ability-tag__boost cursor-pointer"
                        v-tooltip="'Boosts Fleet'"
                    >
                        <IconShareAlt class="text-sm text-teal-900" />
                    </div>
                </div>
                <div class="stat-total__text cursor-pointer">
                    {{ total.category }}
                </div>
                <div
                    class="flex items-center ml-auto stat-total__value"
                    :class="{
                        'stat-total__value--stacked':
                            total.stackedStatTotals.length,
                    }"
                >
                    <div
                        class="stat-total__amount"
                        v-if="total.stackedStatTotals.length"
                    >
                        <template v-if="total.amountType === 'percent'">
                            {{ `${(total.stackedValue * 100).toFixed(2)}%` }}
                        </template>
                        <template v-else>
                            {{ total.stackedValue.toLocaleString() }}
                        </template>
                    </div>
                    <div class="stat-total__amount" v-else>
                        <template v-if="total.amountType === 'percent'">
                            {{ `${(total.value * 100).toFixed(2)}%` }}
                        </template>
                        <template v-else>
                            {{ total.value.toLocaleString() }}
                        </template>
                    </div>
                    <div
                        class="stat-total__strength text-sm"
                        v-if="total.strength > 1"
                    >
                        x{{ total.strength }}
                    </div>
                </div>
            </div>
            <div
                class="stat-total__description pt-1 text-gray-600"
                v-show="opened"
            >
                <div class="flex flex-col gap-y-2">
                    <div class="flex bg-gray-200">
                        <div
                            class="stat-total__info pr-2"
                            v-tooltip="total.source.extra.amountDescription"
                            v-if="
                                total.type ===
                                DataService.ABILITY_TYPES.EXTRA_ATTACK
                            "
                        >
                            <IconQuestionCircle />
                        </div>
                        <div>
                            {{
                                total.stackedStatTotals.length
                                    ? "Primary: "
                                    : ""
                            }}
                            {{ total.description }}
                        </div>
                    </div>

                    <div
                        class="flex bg-gray-200"
                        v-for="(st, index) in total.stackedStatTotals"
                        :key="index"
                    >
                        <div
                            class="stat-total__info pr-2"
                            v-tooltip="st.source.extra.amountDescription"
                            v-if="
                                st.type ===
                                DataService.ABILITY_TYPES.EXTRA_ATTACK
                            "
                        >
                            <IconQuestionCircle />
                        </div>
                        <div>
                            Stacked from generic:
                            {{ st.description }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.stat-total {
    padding: 4px;
    border-radius: 4px;
    margin-bottom: 5px;
    background: #efefef;
    width: 215px;

    &--defense {
        @apply border-blue-500;
    }

    &--attack {
        @apply border-red-500;
    }

    &--passive {
        @apply border-green-500;
    }

    &__value {
        &--stacked {
            background: #222;
            color: #fff;
            padding: 2px 4px;
            line-height: 0;
            border-radius: 4px;
            cursor: pointer;
        }
    }
}
</style>

<script setup>
import { computed } from "vue";
import { getShipChipsCount, parseShipSlotStrengths } from "../../methods/ship";

import Chips from "../Themed/ship/Chips.vue";

const props = defineProps({
    userShip: {
        type: Object,
        required: true,
    },
});

const computedUserShip = computed(() => {
    const userShip = { ...props.userShip };
    parseShipSlotStrengths(userShip.ship);

    return userShip;
});

const chipCount = computed(() => {
    return getShipChipsCount(props.userShip.ship);
});
</script>

<template>
    <div
        v-tooltip="computedUserShip.visible ? false : 'Hidden from workshops'"
        class="ship ship-box relative"
        :class="[
            'ship-box--' + computedUserShip.ship.ship_level.name.toLowerCase(),
            { 'ship--hidden': !computedUserShip.visible },
        ]"
    >
        <div class="ship-box__content">
            <div class="ship-box__content-bg p-2 flex w-full gap-x-3">
                <div class="grow">
                    <div class="flex w-full justify-between">
                        <div>
                            <div>Power {{ computedUserShip.ship.energy }}</div>
                            <div>
                                {{ computedUserShip.ship.abilities.length }}
                                Abilities
                            </div>
                        </div>
                        <div>
                            <div class="ship__chips mb-4 flex">
                                <Chips
                                    class="ml-auto"
                                    :total="chipCount"
                                    :chipLevel="computedUserShip.chip_level"
                                />
                            </div>
                            <div class="ship__actions">
                                <slot name="actions">
                                    <button
                                        class="btn btn-sm btn-green ml-auto"
                                    >
                                        Edit
                                    </button>
                                </slot>
                            </div>
                        </div>
                    </div>

                    <div class="ship-box__strengths flex gap-x-2 items-center">
                        <div class="mr-4 font-medium">Total Strength</div>
                        <div
                            class="ship-box__strengths-total text-center text-xs"
                        >
                            Weapons
                            <div
                                class="text-base font-medium text-grow-green-text-alt"
                            >
                                {{
                                    computedUserShip.ship.slotStrengths.weapon
                                        .total
                                }}
                            </div>
                        </div>
                        <div
                            class="ship-box__strengths-total text-center text-xs"
                        >
                            Armor
                            <div
                                class="text-base font-medium text-grow-green-text-alt"
                            >
                                {{
                                    computedUserShip.ship.slotStrengths.armor
                                        .total
                                }}
                            </div>
                        </div>
                        <div
                            class="ship-box__strengths-total text-center text-xs"
                        >
                            Units
                            <div
                                class="text-base font-medium text-grow-green-text-alt"
                            >
                                {{
                                    computedUserShip.ship.slotStrengths.unit
                                        .total
                                }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="ship-box__caption flex gap-x-4 justify-center">
            <div>
                {{ computedUserShip.ship.name }}
            </div>
            <div class="text-white italic">
                {{ computedUserShip.name }}
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.ship {
    &--hidden {
        filter: grayscale(0.65);
    }
}
.ship-box {
    &__strengths-total {
        div {
            text-shadow: 0px 0px 5px #05774e;
        }
    }
}
</style>

<script setup>
import { computed } from "vue";
import { parseShipSlotStrengths } from "../../methods/ship";

const props = defineProps({
    ship: {
        type: Object,
        required: true,
    },
});

const computedShip = computed(() => {
    const ship = { ...props.ship };
    parseShipSlotStrengths(ship);

    return ship;
});
</script>

<template>
    <div
        class="ship ship-box"
        :class="['ship-box--' + computedShip.ship_level.name.toLowerCase()]"
    >
        <div class="ship-box__content">
            <div class="ship-box__content-bg p-2 flex w-full gapx-3">
                <div class="grow">
                    <div>Power {{ computedShip.energy }}</div>
                    <div>{{ computedShip.abilities.length }} Abilities</div>

                    <div class="ship-box__strengths flex gap-x-2 items-center">
                        <div class="mr-4 font-medium">Total Strength</div>
                        <div
                            class="ship-box__strengths-total text-center text-xs"
                        >
                            Weapons
                            <div
                                class="text-base font-medium text-grow-green-text-alt"
                            >
                                {{ computedShip.slotStrengths.weapon.total }}
                            </div>
                        </div>
                        <div
                            class="ship-box__strengths-total text-center text-xs"
                        >
                            Armor
                            <div
                                class="text-base font-medium text-grow-green-text-alt"
                            >
                                {{ computedShip.slotStrengths.armor.total }}
                            </div>
                        </div>
                        <div
                            class="ship-box__strengths-total text-center text-xs"
                        >
                            Units
                            <div
                                class="text-base font-medium text-grow-green-text-alt"
                            >
                                {{ computedShip.slotStrengths.unit.total }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="ship-box__actions ml-auto shrink">
                    <slot name="actions"></slot>
                </div>
            </div>
        </div>
        <div class="ship-box__caption">
            {{ computedShip.name }}
        </div>
    </div>
</template>

<style lang="less" scoped>
.ship-box {
    &__strengths-total {
        div {
            text-shadow: 0px 0px 5px #05774e;
        }
    }
}
</style>

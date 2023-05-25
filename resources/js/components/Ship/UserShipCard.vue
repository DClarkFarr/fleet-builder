<script setup>
import IconBattery from "~icons/fa-solid/battery-three-quarters";
import Chips from "../Themed/ship/Chips.vue";
import AbilityTag from "../Themed/ability/AbilityTag.vue";

const props = defineProps({
    userShip: {
        type: Object,
        required: true,
    },
    showTags: {
        type: Boolean,
        default: true,
    },
});
</script>

<template>
    <div
        v-tooltip="userShip.visible ? false : 'Hidden from workshops'"
        class="ship ship-box relative leading-none"
        :class="[
            'ship-box--' + userShip.ship.ship_level.name.toLowerCase(),
            { 'ship--hidden': !userShip.visible },
        ]"
    >
        <div class="ship-box__content">
            <div class="ship-box__content-bg p-2 flex w-full gap-x-3">
                <div class="shrink">
                    <div class="flex w-full justify-between">
                        <div class="flex gap-x-2 items-center text-sm mb-1">
                            <div>
                                {{ userShip.ship.ship_class.name }}
                            </div>
                            <div class="flex gap-x-[2px] items-center">
                                <div>
                                    <IconBattery />
                                </div>
                                <div>
                                    {{ userShip.ship.energy }}
                                </div>
                            </div>
                            <div>
                                <Chips
                                    :total="userShip.ship.chipCount"
                                    :chipLevel="userShip.chip_level"
                                    height="8px"
                                />
                            </div>
                        </div>
                    </div>

                    <div class="ship-box__strengths flex gap-x-2 items-center">
                        <div
                            class="ship-box__strengths-total text-center text-xs"
                        >
                            Weapons
                            <div
                                class="text-base font-medium text-grow-green-text-alt"
                            >
                                {{ userShip.ship.slotStrengths.weapon.total }}
                            </div>
                        </div>
                        <div
                            class="ship-box__strengths-total text-center text-xs"
                        >
                            Armor
                            <div
                                class="text-base font-medium text-grow-green-text-alt"
                            >
                                {{ userShip.ship.slotStrengths.armor.total }}
                            </div>
                        </div>
                        <div
                            class="ship-box__strengths-total text-center text-xs"
                        >
                            Units
                            <div
                                class="text-base font-medium text-grow-green-text-alt"
                            >
                                {{ userShip.ship.slotStrengths.unit.total }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="ship__tags grow">
                    <slot name="tags">
                        <div
                            class="flex flex-wrap gap-[2px]"
                            v-if="showTags && userShip.parsedAbilities?.length"
                        >
                            <AbilityTag
                                v-for="parsedAbility in userShip.parsedAbilities"
                                :key="parsedAbility.ability.id_ability"
                                :parsedAbility="parsedAbility"
                            />
                        </div>
                    </slot>
                </div>
                <div class="ship__actions">
                    <slot name="actions">
                        <button class="btn btn-sm btn-green ml-auto">
                            Edit
                        </button>
                    </slot>
                </div>
            </div>
        </div>
        <div class="ship-box__caption flex gap-x-4 justify-center">
            <div class="text-bold">
                L{{ userShip.level }} {{ userShip.ship.name }}
            </div>
            <div class="text-white italic">
                {{ userShip.name }}
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

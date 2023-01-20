<script setup>
const props = defineProps({
    ship: {
        type: Object,
        required: true,
    },
});
</script>

<template>
    <div
        class="ship ship-box"
        :class="['ship-box--' + ship.ship_level.name.toLowerCase()]"
    >
        <div class="ship-box__content">
            <div class="ship-box__content-bg p-2 flex w-full gapx-3">
                <div class="grow">
                    <div>Power {{ ship.energy }}</div>
                    <div>{{ ship.abilities.length }} Abilities</div>

                    <div class="ship-box__strengths flex gap-x-2 items-center">
                        <div class="mr-4 font-medium">Total Strength</div>
                        <div
                            class="ship-box__strengths-total text-center text-xs"
                        >
                            Weapons
                            <div
                                class="text-base font-medium text-grow-green-text-alt"
                            >
                                {{ ship.slotStrengths.weapon.total }}
                            </div>
                        </div>
                        <div
                            class="ship-box__strengths-total text-center text-xs"
                        >
                            Armor
                            <div
                                class="text-base font-medium text-grow-green-text-alt"
                            >
                                {{ ship.slotStrengths.armor.total }}
                            </div>
                        </div>
                        <div
                            class="ship-box__strengths-total text-center text-xs"
                        >
                            Units
                            <div
                                class="text-base font-medium text-grow-green-text-alt"
                            >
                                {{ ship.slotStrengths.unit.total }}
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
            {{ ship.name }}
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

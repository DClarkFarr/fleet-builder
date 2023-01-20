<script setup>
import IconBattery from "~icons/fa-solid/battery-three-quarters";

import Chips from "./Chips.vue";

const props = defineProps({
    userShip: {
        type: Object,
        required: true,
    },
});
</script>

<template>
    <div class="ship-fleet-item item">
        <div
            class="ship ship-box"
            :class="[
                'ship-box--' + userShip.ship.ship_level.name.toLowerCase(),
            ]"
        >
            <div class="ship-box__content">
                <div class="ship-box__content-bg p-2 flex w-full gap-x-3">
                    <div>
                        <div class="flex gap-x-2 text-xs items-center">
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

                        <div
                            class="flex gap-x-2 items-center font-medium leading-none"
                        >
                            <div>
                                {{ userShip.ship.name }}
                            </div>
                            <div class="italic text-xs">
                                {{ userShip.name }}
                            </div>
                        </div>
                    </div>
                    <div></div>
                    <div class="item__actions ml-auto">
                        <slot name="actions"></slot>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped></style>

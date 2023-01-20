<script setup>
import LockIcon from "~icons/fa-solid/unlock-alt";

import { computed, watch, toRaw, ref } from "vue";
import ShipFleetLine from "../ship/ShipFleetLine.vue";
import FleetShipStats from "../fleet/FleetShipStats.vue";
import IconFlag from "~icons/fa-solid/flag";
import FleetParsedAbilityStats from "../fleet/FleetParsedAbilityStats.vue";
import Accordion from "../controls/Accordion.vue";
import FleetAbilityTotals from "../fleet/FleetAbilityTotals.vue";

const props = defineProps({
    statTotals: {
        type: [Object, null],
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    locationName: {
        type: String,
        required: true,
    },
    fleet: {
        type: Object,
        default: null,
    },
});

const emit = defineEmits(["select", "flagship"]);

const openAccordion = ref("");

const onSelectFleet = () => {
    emit(
        "select",
        { slug: props.location, name: props.locationName },
        props.fleet
    );
};

const onClickSetFlagship = (userShip) => {
    emit("flagship", toRaw(props.fleet), toRaw(userShip));
};

const isEmpty = computed(() => {
    return !props.fleet || !props.fleet.stats;
});
</script>

<template>
    <div
        class="fleet flex flex-col h-full"
        :class="{
            'fleet--busy': !isEmpty,
            'fleet--empty': isEmpty,
        }"
    >
        <div
            class="fleet__info grow p-4 rounded min-h-[350px] mb-4 border border-dark-border-start"
        >
            <div class="fleet__used leading-none" v-if="!isEmpty">
                <FleetShipStats :fleet="fleet" />

                <div class="fleet__ships flex flex-col gap-y-2 mb-8">
                    <ShipFleetLine
                        v-for="userShip in fleet.user_ships"
                        :key="`${userShip.id_user_ship}-${userShip.pivot.flagship}`"
                        :userShip="userShip"
                    >
                        <template #actions>
                            <template v-if="userShip.pivot.flagship">
                                <IconFlag
                                    class="text-box-green"
                                    v-tooltip="'Fleet Flagship'"
                                />
                            </template>
                            <template v-else>
                                <button
                                    class="btn btn-blue btn-sm"
                                    @click="() => onClickSetFlagship(userShip)"
                                >
                                    Set
                                    <IconFlag />
                                </button>
                            </template>
                        </template>
                    </ShipFleetLine>
                </div>

                <div
                    class="fleet__basic-stats mb-4"
                    v-if="fleet.user_ships?.length"
                >
                    <Accordion
                        name="fleet-ability-stats"
                        v-model="openAccordion"
                    >
                        <template #title> Stacked Fleet Abilities </template>

                        <template #body>
                            <FleetParsedAbilityStats
                                :fleet="fleet"
                                :parsedAbilities="fleet.parsedAbilities"
                            />
                        </template>
                    </Accordion>
                </div>

                <div
                    class="fleet__total-stats mb-4"
                    v-if="statTotals.totalStats"
                >
                    <Accordion
                        name="fleet-ability-totals"
                        v-model="openAccordion"
                    >
                        <template #title> Fleet Ability Totals </template>

                        <template #body>
                            <FleetAbilityTotals
                                :fleet="fleet"
                                :totals="statTotals.totalStats"
                            />
                        </template>
                    </Accordion>
                </div>
            </div>
            <div class="fleet__placeholder" v-else>No Fleet Assigned</div>
        </div>
        <div
            class="fleet__bottom shrink flex flex-col items-center"
            @click="onSelectFleet"
        >
            <div class="fleet__button">
                <template v-if="!isEmpty">
                    <img src="/images/fleet-icon.png" />
                </template>
                <template v-else>
                    <LockIcon />
                </template>
            </div>
            <div class="sleet-slot__label text-xs text-white">
                {{ locationName }}
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.fleet {
    &__info {
        background: linear-gradient(
            180deg,
            rgba(1, 1, 6, 0.64),
            rgba(0, 0, 0, 0.25)
        );

        box-shadow: 0 0 3px 0 #517090;
    }

    &__button {
        @apply flex items-center justify-center cursor-pointer;

        background-image: url("/resources/images/hexagon-md.png");
        background-size: contain;
        background-position: center center;
        background-repeat: no-repeat;

        height: 50px;
        width: 50px;

        .fleet--empty & {
            color: #485562;

            &:hover {
                color: #8096ac;
            }
        }

        .fleet--busy & {
            img {
                width: 25px;
            }
        }
    }

    &--empty {
        .fleet {
            &__info {
                @apply flex items-center justify-center;
            }
            &__placeholder {
                @apply text-white font-bold text-2xl;

                mix-blend-mode: soft-light;
            }
        }
    }
}
</style>

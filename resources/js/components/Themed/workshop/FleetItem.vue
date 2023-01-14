<script setup>
import LockIcon from "~icons/fa-solid/unlock-alt";

import { computed, watch } from "vue";
import ShipFleetLine from "../ship/ShipFleetLine.vue";

const props = defineProps({
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

const emit = defineEmits(["select"]);

const onSelectFleet = () => {
    emit(
        "select",
        { slug: props.location, name: props.locationName },
        props.fleet
    );
};

const isEmpty = computed(() => {
    return !props.fleet || !props.fleet.stats;
});
</script>

<template>
    <div
        class="fleet"
        :class="{
            'fleet--busy': !isEmpty,
            'fleet--empty': isEmpty,
        }"
    >
        <div
            class="fleet__info p-4 rounded min-h-[350px] mb-4 border border-dark-border-start"
        >
            <div class="fleet__used leading-none" v-if="!isEmpty">
                <div
                    class="fleet__top-stats flex gap-x-2 justify-between items-center mb-4"
                >
                    <div class="fleet__leadership">
                        <div class="text-xs text-text-blue">Leadership</div>
                        <div class="text-center">
                            <span>
                                <b>{{ fleet.stats.leadershipUsed }}</b>
                            </span>
                            /
                            <span>
                                <b>{{ fleet.leadership }}</b>
                            </span>

                            <span
                                v-if="fleet.stats.leadershipRemaining !== 0"
                                class="font-bold cursor-pointer"
                                v-tooltip="
                                    fleet.stats.leadershipRemaining
                                        ? 'Leader remaining'
                                        : 'Leadership exceeded'
                                "
                                :class="{
                                    'text-grow-green-text-alt':
                                        fleet.stats.leadershipRemaining > 0,
                                    'text-btn-red-border':
                                        fleet.stats.leadershipRemaining < 0,
                                }"
                            >
                                ({{
                                    fleet.stats.leadershipRemaining > 0
                                        ? "+"
                                        : "-"
                                }}{{ fleet.stats.leadershipRemaining }})
                            </span>
                        </div>
                    </div>
                    <div class="fleet__ship-count">
                        <div class="text-center text-xs text-text-blue">
                            Ships
                        </div>
                        <div class="text-center">
                            <b> {{ fleet.stats.shipCount }} / 9 </b>
                        </div>
                    </div>
                </div>

                <div class="fleet__ships flex flex-col gap-y-2">
                    <ShipFleetLine
                        v-for="userShip in fleet.user_ships"
                        :key="userShip.id"
                        :userShip="userShip"
                    />
                </div>
            </div>
            <div class="fleet__placeholder" v-else>No Fleet Assigned</div>
        </div>
        <div
            class="fleet__bottom flex flex-col items-center"
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

<script setup>
import { watch } from "vue";
const props = defineProps({
    fleet: {
        type: Object,
        required: true,
    },
});
</script>

<template>
    <div
        class="fleet__top-stats flex gap-x-2 justify-between items-center mb-4 leading-none"
        v-if="fleet.stats"
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
                        fleet.stats.leadershipRemaining > 0
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
                    ({{ fleet.stats.leadershipRemaining > 0 ? "+" : ""
                    }}{{ fleet.stats.leadershipRemaining }})
                </span>
            </div>
        </div>
        <div class="fleet__ship-count">
            <div class="text-center text-xs text-text-blue">Ships</div>
            <div class="text-center">
                <b> {{ fleet.stats.shipCount }} / 9 </b>
            </div>
        </div>
    </div>
</template>

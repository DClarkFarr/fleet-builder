<script setup>
import ContentBox from "./ContentBox.vue";

import { ref, reactive, computed } from "vue";

const props = defineProps({});
</script>

<template>
    <vue-final-modal
        classes="modal-container"
        content-class="w-full modal-content--2xl"
    >
        <ContentBox class="w-full" bg-class="custom-bg">
            <div class="quick-reference">
                <h2 class="text-2xl text-modal-title font-medium mb-10">
                    Quick Reference Guide
                </h2>

                <div class="mb-6">
                    <h3 class="text-2xl text-modal-title font-medium mb-4">
                        Strength by size
                    </h3>
                    <p class="mb-2">
                        Armor, weapons and units have 3 sizes: Small, Medium,
                        and Large. For calculating total ship strength, we use
                        the following weights:
                    </p>
                    <div class="block">
                        <div class="pl-2">
                            <div>S: 1</div>
                            <div>M: 2</div>
                            <div>L: 4</div>
                        </div>
                    </div>
                </div>

                <div class="mb-6">
                    <h3 class="text-2xl text-modal-title font-medium mb-4">
                        Ship Strength
                    </h3>
                    <p class="mb-2">
                        Each ship has weapon, armor and unit slots, either size
                        Small, Medium or Large. Strength is a sum of those
                        values, as applicable.
                    </p>
                    <div class="block">
                        <div>Example: Puck Frigate Weaon Strength</div>
                        <div class="pl-2">
                            <div>S: 3</div>
                            <div>M: 2</div>
                            <div>L: 0</div>
                            <div>Total: 7 // (3 * 1) + (2 * 2)</div>
                        </div>
                    </div>
                </div>

                <div class="mb-6">
                    <h3 class="text-2xl text-modal-title font-medium mb-4">
                        Fleet Totals: Affected Strength
                    </h3>
                    <p class="mb-2">
                        This is the sum of affected ship weapon strength,
                        filtered by applicable ships and weapon sizes.
                    </p>
                    <div class="block">
                        <div>Example: Antu'Valu L weapons + 63%</div>
                        <div class="pl-2">
                            <div>1) Get all ships in fleet</div>
                            <div>2) Get L weapon strength of each ship</div>
                            <div>3) Sum the weapon strength</div>
                        </div>
                    </div>
                </div>
            </div>
        </ContentBox>
    </vue-final-modal>
</template>

<style lang="less">
.custom-bg {
    background: rgba(65, 88, 108, 0.75);
}

.block {
    @apply bg-dark-bg-start/75 p-6 text-white;
}
</style>

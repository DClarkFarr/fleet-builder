<script setup>
import ContentBox from "./ContentBox.vue";

import { ref, reactive, computed } from "vue";

const props = defineProps({});
</script>

<template>
    <vue-final-modal
        classes="modal-container"
        content-class="w-full modal-content--4xl"
    >
        <ContentBox class="w-full" bg-class="custom-bg">
            <div class="quick-reference">
                <h2 class="text-2xl text-gray-800 font-medium mb-10">
                    Submit Ship
                </h2>
            </div>
        </ContentBox>
    </vue-final-modal>
</template>

<style lang="less">
.custom-bg {
    background: #fff;
}
</style>

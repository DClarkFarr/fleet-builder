<script setup>
import ContentBox from "../ContentBox.vue";
import WorkshopForm from "./WorkshopForm.vue";

const props = defineProps({
    workshop: {
        type: Object,
        default: null,
    },
    onSave: {
        type: Function,
        required: true,
    },
});
</script>

<template>
    <vue-final-modal
        classes="modal-container"
        content-class="w-full modal-content--xl"
    >
        <ContentBox class="w-full" bg-class="custom-bg">
            <WorkshopForm :onSave="props.onSave" :workshop="workshop" />
        </ContentBox>
    </vue-final-modal>
</template>

<style lang="less" scoped>
.custom-bg {
    background: rgba(87, 122, 150, 0.5);
}
</style>

<script setup>
import { computed } from "vue";

import ContentBox from "../ContentBox.vue";
import UserShipSelectList from "./UserShipSelectList.vue";

const props = defineProps({
    userShips: {
        type: Object, // computed<UserShip[]>
        required: true,
    },
    shipClasses: {
        type: Array,
        required: true,
    },
    busy: {
        type: Object, // ref<boolean>
        default: false,
    },
});

const emit = defineEmits(["select", "unselect"]);

const onClickSelect = (userShip) => {
    emit("select", userShip);
};

const onClickUnselect = (userShip) => {
    emit("unselect", userShip);
};

const isBusy = computed(() => props.busy.value);
const computedUserShips = computed(() => props.userShips.value);
</script>

<template>
    <vue-final-modal
        classes="modal-container"
        content-class="w-full modal-content--lg"
    >
        <ContentBox class="w-full" bg-class="custom-bg">
            <UserShipSelectList
                :userShips="computedUserShips"
                :shipClasses="shipClasses"
                :busy="isBusy"
                @select="onClickSelect"
                @unselect="onClickUnselect"
            />
        </ContentBox>
    </vue-final-modal>
</template>

<style lang="less">
.custom-bg {
    background: rgba(87, 122, 150, 0.5);
}
</style>

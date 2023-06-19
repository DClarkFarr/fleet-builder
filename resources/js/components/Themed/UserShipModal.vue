<script setup>
import ContentBox from "./ContentBox.vue";
import UserShipForm from "../Ship/UserShipForm.vue";
import { ref, watch } from "vue";

const props = defineProps({
    userShip: {
        type: Object,
        required: true,
    },
    onSave: {
        type: Function,
        required: true,
    },
    onDelete: {
        type: Function,
        default: null,
    },
    onUpdate: {
        type: Function,
        default: null,
    },
});

const internalUserShip = ref(props.userShip);

watch(
    () => props.userShip,
    (newVal) => {
        internalUserShip.value = newVal;
    }
);

const onSaveShip = (data) => {
    return props.onSave(data);
};

const onUpdateShip = async (idUserShip, data) => {
    if (typeof props.onUpdate === "function") {
        await props.onUpdate(idUserShip, data);
    }

    internalUserShip.value = {
        ...internalUserShip.value,
        ...data,
    };
};
const onDeleteShip = (userShip) => {
    if (props.onDelete) {
        return props.onDelete(userShip);
    }
};
</script>

<template>
    <vue-final-modal
        classes="modal-container"
        content-class="w-full modal-content--xl"
    >
        <ContentBox class="w-full" bg-class="custom-bg">
            <div class="add-ship">
                <h2 class="text-xl text-modal-title font-medium mb-4">
                    Update your ship
                </h2>

                <UserShipForm
                    :ship="userShip.ship"
                    :userShip="internalUserShip"
                    :onSave="onSaveShip"
                    :onDelete="onDeleteShip"
                    :onUpdate="onUpdateShip"
                />
            </div>
        </ContentBox>
    </vue-final-modal>
</template>

<style lang="less">
.custom-bg {
    background: rgba(87, 122, 150, 0.5);
}
</style>

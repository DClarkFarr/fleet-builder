<script setup>
import { onMounted } from "vue";
import { $vfm } from "vue-final-modal";
import useUserStore from "../../stores/userStore";
import QuickGuideModal from "./QuickGuideModal.vue";
import SubmitShipModal from "./SubmitShipModal.vue";

const props = defineProps({});

const userStore = useUserStore();

const showQuickReferenceModal = () => {
    console.log("trying to show");
    $vfm.show({
        component: QuickGuideModal,
    });
};

const showSubmitShipModal = () => {
    $vfm.show({
        component: SubmitShipModal,
    });
};

onMounted(() => {
    if (!userStore.user) {
        userStore.refresh();
    }
});
</script>

<template>
    <div class="workshop__help bg-dark-bg-start/75 p-6 flex gap-x-6 mb-6">
        <div>
            <button
                type="button"
                class="btn btn-blue"
                @click="showQuickReferenceModal()"
            >
                Quick Reference Guide
            </button>
        </div>
        <div>
            <button
                type="button"
                class="btn btn-blue"
                v-if="userStore.isTester"
                @click="showSubmitShipModal"
            >
                Missing a ship?
            </button>
        </div>
    </div>
</template>

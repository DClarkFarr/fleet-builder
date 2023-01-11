<script setup>
import { onBeforeMount, ref } from "vue";
import { $vfm } from "vue-final-modal";

import BuilderLayout from "../../components/layouts/BuilderLayout.vue";
import useBuilderStore from "../../stores/builderStore";

const builderStore = useBuilderStore();

const allLoaded = ref(false);

onBeforeMount(() => {
    const def1 = builderStore.ships.length
        ? Promise.resolve()
        : builderStore.loadShips();
    const def2 = builderStore.userShips.length
        ? Promise.resolve()
        : builderStore.loadUserShips();
    const def3 = builderStore.shipClasses.length
        ? Promise.resolve()
        : builderStore.loadShipClasses();
    const def4 = builderStore.workshops.length
        ? Promise.resolve()
        : builderStore.loadWorkshops();

    Promise.all([def1, def2, def3, def4]).then(() => {
        allLoaded.value = true;
    });
});
</script>
<template>
    <BuilderLayout>
        <div class="workshop flex w-full justify-center items-center">
            <div class="workshop__content w-full max-w-4xl p-6 text-modal-text">
                you do you!
            </div>
        </div>
    </BuilderLayout>
</template>

<style lang="less">
.workshop {
    min-height: 100vh;

    .has-admin-bar & {
        min-height: calc(100vh - 32px);
    }
}
</style>

<style lang="less" scoped></style>

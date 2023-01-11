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
                <div class="hexagon">
                    <div class="hexagon__inner"></div>
                </div>
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

<style lang="less" scoped>
.hexagon {
    --s: 100px; /* size  */
    --m: 4px; /* margin */
    --f: calc(1.732 * var(--s) + 4 * var(--m) - 1px);
    font-size: 0; /*disable white space between inline block element */
}

.hexagon__inner {
    width: var(--s);
    margin: var(--m);
    height: calc(var(--s) * 1.1547);
    display: inline-block;
    font-size: initial;
    clip-path: polygon(0% 25%, 0% 75%, 50% 100%, 100% 75%, 100% 25%, 50% 0%);
    background: red;
    margin-bottom: calc(var(--m) - var(--s) * 0.2885);

    border: solid 2px yellow;
}

.hexagon::before {
    content: "";
    width: calc(var(--s) / 2 + var(--m));
    float: left;
    height: 120%;
    shape-outside: repeating-linear-gradient(
        rgb(221, 244, 91) 0 calc(var(--f) - 3px),
        rgb(24, 187, 89) 0 var(--f)
    );
}
</style>

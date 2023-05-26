<script setup>
import { onMounted, ref } from "vue";
import BuilderLayout from "../../components/layouts/BuilderLayout.vue";
import { getUserShipParsedAbilityStats } from "../../methods/abilityStatParser";
import useBuilderStore from "../../stores/builderStore";
import useUserStore from "../../stores/userStore";

import Chips from "@/components/Themed/ship/Chips.vue";

const builderStore = useBuilderStore();
const userStore = useUserStore();

const onClickLogout = () => {
    userStore.logout();
};

const allLoaded = ref(false);

const statAbilityShips = ref([]);

onMounted(async () => {
    const def1 = builderStore.ships.length
        ? Promise.resolve()
        : builderStore.loadShips();
    const def2 = builderStore.userShips.length
        ? Promise.resolve()
        : builderStore.loadUserShips();
    const def3 = builderStore.shipClasses.length
        ? Promise.resolve()
        : builderStore.loadShipClasses();

    await Promise.all([def1, def2, def3]).then(() => {
        allLoaded.value = true;
    });

    statAbilityShips.value = [...builderStore.userShips].map((userShip) => {
        const stats = getUserShipParsedAbilityStats(userShip);

        return {
            ...userShip,
            ...stats,
        };
    });
});
</script>

<template>
    <BuilderLayout>
        <div class="flex w-full justify-end p-4">
            <router-link to="/" class="banner__link" @click="onClickLogout">
                Logout
            </router-link>
        </div>

        <div class="ships-viewer p-6 bg-white mx-8">
            <div class="controls">controls</div>
            <div class="table-wrapper">
                <table class="table w-full" cellspacing="0" cellpadding="0">
                    <thead>
                        <tr>
                            <th>Ship</th>
                            <th>Slots</th>
                            <th>Damage</th>
                            <th>Armor</th>
                            <th>Resistance</th>
                            <th>Shield</th>
                            <th>Flagship</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="userShip in statAbilityShips"
                            :key="userShip.id_user_ship"
                        >
                            <td>
                                <div class="text-xs flex gap-x-2">
                                    <div>
                                        {{ userShip.ship.ship_class.name }}
                                    </div>
                                    <div class="text-red-600 font-bold">
                                        {{ userShip.ship.energy }}
                                    </div>
                                </div>
                                <div class="flex gap-x-2 leading-none">
                                    <div>
                                        {{ userShip.ship.name }}
                                    </div>
                                    <div class="pt-[4px]">
                                        <Chips
                                            :total="userShip.ship.chipCount"
                                            :chipLevel="userShip.chip_level"
                                            height="10px"
                                        />
                                    </div>
                                </div>
                            </td>
                            <td>
                                Armor
                                <div class="flex gap-x-2 mb-2">
                                    <div class="flex gap-x-1 items-center">
                                        <div
                                            class="bg-gray-700 text-white leading-none rounded-[4px] py-[2px] px-[4px] text-sm"
                                        >
                                            S
                                        </div>
                                        <div>
                                            {{
                                                userShip.ship.slotStrengths
                                                    .armor.s
                                            }}
                                        </div>
                                    </div>
                                    <div class="flex gap-x-1 items-center">
                                        <div
                                            class="bg-gray-700 text-white leading-none rounded-[4px] py-[2px] px-[4px] text-sm"
                                        >
                                            M
                                        </div>
                                        <div>
                                            {{
                                                userShip.ship.slotStrengths
                                                    .armor.m
                                            }}
                                        </div>
                                    </div>
                                    <div class="flex gap-x-1 items-center">
                                        <div
                                            class="bg-gray-700 text-white leading-none rounded-[4px] py-[2px] px-[4px] text-sm"
                                        >
                                            L
                                        </div>
                                        <div>
                                            {{
                                                userShip.ship.slotStrengths
                                                    .armor.l
                                            }}
                                        </div>
                                    </div>
                                </div>

                                Units
                                <div class="flex gap-x-2 mb-2">
                                    <div class="flex gap-x-1 items-center">
                                        <div
                                            class="bg-gray-700 text-white leading-none rounded-[4px] py-[2px] px-[4px] text-sm"
                                        >
                                            S
                                        </div>
                                        <div>
                                            {{
                                                userShip.ship.slotStrengths.unit
                                                    .s
                                            }}
                                        </div>
                                    </div>
                                    <div class="flex gap-x-1 items-center">
                                        <div
                                            class="bg-gray-700 text-white leading-none rounded-[4px] py-[2px] px-[4px] text-sm"
                                        >
                                            M
                                        </div>
                                        <div>
                                            {{
                                                userShip.ship.slotStrengths.unit
                                                    .m
                                            }}
                                        </div>
                                    </div>
                                    <div class="flex gap-x-1 items-center">
                                        <div
                                            class="bg-gray-700 text-white leading-none rounded-[4px] py-[2px] px-[4px] text-sm"
                                        >
                                            L
                                        </div>
                                        <div>
                                            {{
                                                userShip.ship.slotStrengths.unit
                                                    .l
                                            }}
                                        </div>
                                    </div>
                                </div>

                                Weapons
                                <div class="flex gap-x-2">
                                    <div class="flex gap-x-1 items-center">
                                        <div
                                            class="bg-gray-700 text-white leading-none rounded-[4px] py-[2px] px-[4px] text-sm"
                                        >
                                            S
                                        </div>
                                        <div>
                                            {{
                                                userShip.ship.slotStrengths
                                                    .weapon.s
                                            }}
                                        </div>
                                    </div>
                                    <div class="flex gap-x-1 items-center">
                                        <div
                                            class="bg-gray-700 text-white leading-none rounded-[4px] py-[2px] px-[4px] text-sm"
                                        >
                                            M
                                        </div>
                                        <div>
                                            {{
                                                userShip.ship.slotStrengths
                                                    .weapon.m
                                            }}
                                        </div>
                                    </div>
                                    <div class="flex gap-x-1 items-center">
                                        <div
                                            class="bg-gray-700 text-white leading-none rounded-[4px] py-[2px] px-[4px] text-sm"
                                        >
                                            L
                                        </div>
                                        <div>
                                            {{
                                                userShip.ship.slotStrengths
                                                    .weapon.l
                                            }}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </BuilderLayout>
</template>

<style lang="less" scoped>
.table {
    th {
        text-align: left;
        border-bottom: solid 2px #888;
    }

    td {
        padding: 10px;
    }
}
</style>

<script setup>
import { onMounted, ref } from "vue";
import BuilderLayout from "../../components/layouts/BuilderLayout.vue";
import {
    getUserShipParsedAbilityStats,
    sumFleetTotalStats,
} from "../../methods/abilityStatParser";
import useBuilderStore from "../../stores/builderStore";
import useUserStore from "../../stores/userStore";

import Chips from "@/components/Themed/ship/Chips.vue";
import { summedStatsTotalToText } from "../../methods/summedAbilityToText";
import DataService from "../../services/DataService";
import StatTotal from "../../components/Themed/ability/StatTotal.vue";

const builderStore = useBuilderStore();
const userStore = useUserStore();

const onClickLogout = () => {
    userStore.logout();
};

const allLoaded = ref(false);

const statAbilityShips = ref([]);

const attackColumns = [
    DataService.ABILITY_TYPES.INCREASE_ATTACK_SPEED,
    DataService.ABILITY_TYPES.INCREASE_WEAPON_DAMAGE,
    DataService.ABILITY_TYPES.INCREASE_ACCURACY,
    DataService.ABILITY_TYPES.INCREASE_EVADE,
    DataService.ABILITY_TYPES.EXTRA_ATTACK,
];

const armorColumns = [
    [
        DataService.ABILITY_TYPES.REDUCE_DAMAGE,
        DataService.RESISTANCE_TYPES.ARMOR,
    ],
    DataService.ABILITY_TYPES.INCREASE_ARMOR,
];

const resistanceColumns = [DataService.ABILITY_TYPES.INCREASE_RESISTENCE];

const hpColumns = [
    DataService.ABILITY_TYPES.INCREASE_HP,
    [DataService.ABILITY_TYPES.REDUCE_DAMAGE, DataService.RESISTANCE_TYPES.HP],
];

const shieldColumns = [
    [
        DataService.ABILITY_TYPES.REDUCE_DAMAGE,
        DataService.RESISTANCE_TYPES.SHIELDS,
    ],
    DataService.ABILITY_TYPES.INCREASE_SHIELD,
];

const penetrationColumns = [DataService.ABILITY_TYPES.INCREASE_PENETRATION];

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

    console.time("onMounted");

    statAbilityShips.value = [...builderStore.userShips]
        // .filter((userShip) => userShip.id_user_ship === 77)
        .map((userShip) => {
            const { totalStats: shipTotalStats } =
                getUserShipParsedAbilityStats(userShip, false);
            const { totalStats: flagTotalStats } =
                getUserShipParsedAbilityStats(userShip, true);

            const shipTotals = sumFleetTotalStats(null, shipTotalStats).map(
                (row) => {
                    return {
                        ...row,
                        ...summedStatsTotalToText(row, {
                            shipClasses: builderStore.shipClasses,
                        }),
                    };
                }
            );

            const flagTotals = sumFleetTotalStats(null, flagTotalStats).map(
                (row) => {
                    return {
                        ...row,
                        ...summedStatsTotalToText(row, {
                            shipClasses: builderStore.shipClasses,
                        }),
                    };
                }
            );

            const attackTotals = [];
            const penetrationTotals = [];
            const armorTotals = [];
            const resistanceTotals = [];
            const hpTotals = [];
            const shieldTotals = [];
            const unsortedTotals = [];

            const matchVariantColumn = (col, row) => {
                if (typeof col === "string") {
                    return row.abilityType === col;
                } else if (typeof col === "object" && col.length === 2) {
                    return (
                        row.abilityType === col[0] &&
                        row.variants.includes(col[1])
                    );
                }
                return false;
            };

            shipTotals.forEach((row) => {
                if (attackColumns.includes(row.abilityType)) {
                    attackTotals.push(row);
                } else if (
                    armorColumns.some((col) => matchVariantColumn(col, row))
                ) {
                    armorTotals.push(row);
                } else if (resistanceColumns.includes(row.abilityType)) {
                    resistanceTotals.push(row);
                } else if (
                    hpColumns.some((col) => matchVariantColumn(col, row))
                ) {
                    hpTotals.push(row);
                } else if (
                    shieldColumns.some((col) => matchVariantColumn(col, row))
                ) {
                    shieldTotals.push(row);
                } else if (penetrationColumns.includes(row.abilityType)) {
                    penetrationTotals.push(row);
                } else {
                    unsortedTotals.push(row);
                }
            });

            return {
                ...userShip,
                shipTotals,
                flagTotals,
                attackTotals,
                penetrationTotals,
                armorTotals,
                resistanceTotals,
                hpTotals,
                shieldTotals,
                unsortedTotals,
            };
        });

    console.timeEnd("onMounted");
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
                            <th>Slot Strength</th>
                            <th>Damage</th>
                            <th>Penetration</th>
                            <th>Armor</th>
                            <th>Resistance</th>
                            <th>HP</th>
                            <th>Shield</th>
                            <th>Flagship</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(userShip, index) in statAbilityShips"
                            :key="userShip.id_user_ship"
                            :data-index="index"
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
                            <td data-col="slots">
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
                            <td data-col="damage">
                                <StatTotal
                                    v-for="(
                                        total, index
                                    ) in userShip.attackTotals"
                                    :key="index"
                                    :total="total"
                                />
                            </td>
                            <td>
                                <StatTotal
                                    v-for="(
                                        total, index
                                    ) in userShip.penetrationTotals"
                                    :key="index"
                                    :total="total"
                                />
                            </td>
                            <td>
                                <StatTotal
                                    v-for="(
                                        total, index
                                    ) in userShip.armorTotals"
                                    :key="index"
                                    :total="total"
                                />
                            </td>
                            <td>
                                <StatTotal
                                    v-for="(
                                        total, index
                                    ) in userShip.resistanceTotals"
                                    :key="index"
                                    :total="total"
                                />
                            </td>
                            <td>
                                <StatTotal
                                    v-for="(total, index) in userShip.hpTotals"
                                    :key="index"
                                    :total="total"
                                />
                            </td>
                            <td>
                                <StatTotal
                                    v-for="(
                                        total, index
                                    ) in userShip.shieldTotals"
                                    :key="index"
                                    :total="total"
                                />
                            </td>
                            <td>
                                <StatTotal
                                    v-for="(
                                        total, index
                                    ) in userShip.flagTotals"
                                    :key="index"
                                    :total="total"
                                />
                            </td>
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

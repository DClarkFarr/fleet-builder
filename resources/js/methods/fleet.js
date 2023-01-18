import { toRaw } from "vue";
import DataService from "../services/DataService";
import { abilityHasQualifiers } from "./abilityTextParser";

export const parseFleetBasicStats = (fleet) => {
    const stats = {
        leadershipUsed: 0,
        leadershipRemaining: 0,
        shipCount: fleet.user_ships.length,
        shipsByClass: {},
    };

    let leadershipUsed = 0;
    fleet.user_ships.forEach((userShip) => {
        const ship = userShip.ship;
        if (!stats.shipsByClass[ship.id_class]) {
            stats.shipsByClass[ship.id_class] = [];
        }
        stats.shipsByClass[ship.id_class].push(userShip.id_user_ship);

        leadershipUsed += ship.energy;
    });

    stats.leadershipUsed = leadershipUsed;
    stats.leadershipRemaining = fleet.leadership - leadershipUsed;

    return stats;
};

export const getShortAbilitySlug = (ability) => {
    const parts = [ability.type];

    if (ability.variants.length) {
        parts.push(`variant:` + ability.variants.join("|"));
    }

    return parts.join(",");
};

export const getFullAbilitySlug = (ability) => {
    const parts = [ability.type];

    if (ability.variants.length) {
        parts.push(`variant:` + ability.variants.join("|"));
    }

    // if (ability.conditions.length) {
    //     parts.push(
    //         `condition:` +
    //             ability.conditions
    //                 .map((c) => {
    //                     if (c.type === "id_class") {
    //                         return `id_class:(${c.select.join("|")}${
    //                             c.operator
    //                         }${c.value})`;
    //                     }

    //                     return "bad_type--" + c.type;
    //                 })
    //                 .join("|")
    //     );
    // }

    if (ability.repeat_type) {
        parts.push(`repeat:${ability.repeat_type}:${ability.repeat}`);
    }

    if (ability.duration_type) {
        parts.push(`duration:${ability.duration_type}:${ability.duration}`);
    }

    if (ability.for_class_ids.length) {
        parts.push(`for_class:${ability.for_class_ids.join("|")}`);
    }

    if (ability.target_class_ids.length) {
        parts.push(`target_class:${ability.target_class_ids.join("|")}`);
    }

    if (ability.weapon_classes.length) {
        parts.push(`weapon_class:${ability.weapon_classes.join("|")}`);
    }

    if (ability.weapon_sizes.length) {
        parts.push(`weapon_size:${ability.weapon_sizes.join("|")}`);
    }

    return parts.join(",");
};

export const doesFleetMeetAbilityConditions = (fleet, ability) => {
    const shipsByClass = fleet.stats.shipsByClass;

    const meetsConditions = ability.conditions.every((condition) => {
        if (condition.type === "id_class") {
            if (condition.operator === DataService.OPERATORS.EQUALS) {
                return condition.select.every((selectIdClass) => {
                    const shipClassCount = shipsByClass[selectIdClass]
                        ? shipsByClass[selectIdClass].length
                        : 0;
                    return shipClassCount === condition.value;
                });
            } else if (condition.operator === DataService.OPERATORS.GREATER) {
                return condition.select.every((selectIdClass) => {
                    const shipClassCount = shipsByClass[selectIdClass]
                        ? shipsByClass[selectIdClass].length
                        : 0;
                    return shipClassCount > condition.value;
                });
            } else if (condition.operator === DataService.OPERATORS.LESS) {
                return condition.select.every((selectIdClass) => {
                    const shipClassCount = shipsByClass[selectIdClass]
                        ? shipsByClass[selectIdClass].length
                        : 0;
                    return shipClassCount < condition.value;
                });
            }
        }

        return true;
    });

    return meetsConditions;
};

export const isDuplicateAbility = (parsedAbility, parsedAbilities) => {
    return parsedAbilities.some(
        (pa) => pa.ability.id_ability === parsedAbility.ability.id_ability
    );
};

export const parseFleetShipsAbilities = (fleet) => {
    const parsedAbilities = [];

    fleet.user_ships.forEach((userShip) => {
        const parsedShipAbilities = userShip.parsedAbilities
            .map((pa) => toRaw(pa))
            .map((pa) => {
                pa.meetsConditions = true;
                if (pa.hasConditions) {
                    pa.meetsConditions = doesFleetMeetAbilityConditions(
                        fleet,
                        pa.ability
                    );
                }
                return {
                    ...pa,
                    source: {
                        id_user_ship: userShip.id_user_ship,
                        id_ship: userShip.ship.id_ship,
                        ship_class: userShip.ship.ship_class,
                        ship_level: userShip.ship.ship_level,
                        nickname: userShip.name,
                        name: userShip.ship.name,
                    },
                };
            });

        const isFlagship = !!userShip.pivot.flagship;

        parsedShipAbilities.forEach((parsedAbility) => {
            const ability = parsedAbility.ability;

            const appliesToFleet = ability.applies_to_fleet;
            const flagshipRequired = ability.flagship_required;

            const canAddAbility =
                (appliesToFleet && !flagshipRequired) ||
                (appliesToFleet && flagshipRequired && isFlagship);

            if (
                canAddAbility &&
                !isDuplicateAbility(parsedAbility, parsedAbilities)
            ) {
                parsedAbilities.push(parsedAbility);
            }
        });
    });

    return parsedAbilities;
};

export const parseUserShipAbility = (userShip, ability) => {
    const fullSlug = getFullAbilitySlug(ability);
    const shortSlug = getShortAbilitySlug(ability);

    const hasConditions = ability.conditions.length > 0;
    const hasQualifiers = abilityHasQualifiers(ability);

    return {
        ability,
        userShip,
        fullSlug,
        shortSlug,
        hasConditions,
        hasQualifiers,
    };
};

export const parseUserShipAbilities = (userShip, callback = null) => {
    const ship = userShip.ship;
    const abilities = ship.abilities;

    const parsedAbilities = [];

    abilities.forEach((ability) => {
        const parsedAbility = parseUserShipAbility(userShip, ability);

        if (typeof callback === "function") {
            parsedAbility.extra = callback(parsedAbility);
        }

        const canAddAbility = ability.location.includes("chip_")
            ? parseInt(ability.location.split("_")[1]) <= userShip.chip_level
            : true;

        if (canAddAbility) {
            parsedAbilities.push(parsedAbility);
        }
    });

    return parsedAbilities;
};

export const sortUserShipsBySelectedIds = (userShips, selectedIds = []) => {
    userShips.sort((a, b) => {
        const aInFleet = selectedIds.includes(a.id_user_ship);
        const bInFleet = selectedIds.includes(b.id_user_ship);
        if (aInFleet && !bInFleet) {
            return -1;
        } else if (!aInFleet && bInFleet) {
            return 1;
        }

        shortUserShipsCallback(a, b);
    });

    return userShips;
};

export const shortUserShipsCallback = (a, b) => {
    if (a.ship.ship_level.sort != b.ship.ship_level.sort) {
        return b.ship.ship_level.sort - a.ship.ship_level.sort;
    }

    if (a.ship.ship_class.sort != b.ship.ship_class.sort) {
        return b.ship.ship_class.sort - a.ship.ship_class.sort;
    }

    return b.energy - a.energy;
};

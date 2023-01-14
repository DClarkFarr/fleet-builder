import DataService from "../services/DataService";

export const parseFleetStats = (fleet) => {
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

    if (ability.conditions.length) {
        parts.push(
            `condition:` +
                ability.conditions
                    .map((c) => {
                        if (c.type === "id_class") {
                            return `id_class:(${c.select.join("|")}${
                                c.operator
                            }${c.value})`;
                        }

                        return "bad_type--" + c.type;
                    })
                    .join("|")
        );
    }

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

export const parseFleetShipAbility = (fleet, userShip, ability) => {
    if (!fleet.stats) {
        throw new Error(
            "Fleet must have parsed stats before parsing abilities"
        );
    }

    const fullSlug = getFullAbilitySlug(ability);
    const shortSlug = getShortAbilitySlug(ability);

    const hasConditions = ability.conditions.length > 0;
    const meetsConditions = doesFleetMeetAbilityConditions(fleet, ability);

    return {
        ability,
        userShip,
        fullSlug,
        shortSlug,
        hasConditions,
        meetsConditions,
    };
};

export const isDuplicateAbility = (parsedAbility, parsedAbilities) => {
    return parsedAbilities.some(
        (pa) => pa.ability.id_ability === parsedAbility.ability.id_ability
    );
};

export const parseFleetShipsAbilities = (fleet) => {
    const parsedAbilities = {
        flagship: [],
        core: [],
        chip: [],
    };

    fleet.user_ships.forEach((userShip) => {
        const ship = userShip.ship;
        const abilities = ship.abilities;
        abilities.forEach((ability) => {
            const parsedAbility = parseFleetShipAbility(
                fleet,
                userShip,
                ability
            );

            if (ability.location.includes("flagship_")) {
                if (
                    !isDuplicateAbility(parsedAbility, parsedAbilities.flagship)
                ) {
                    parsedAbilities.flagship.push(parsedAbility);
                }
            } else if (ability.location.includes("ability_")) {
                if (!isDuplicateAbility(parsedAbility, parsedAbilities.core)) {
                    parsedAbilities.core.push(parsedAbility);
                }
            } else if (ability.location.includes("chip_")) {
                const chipNum = parseInt(ability.location.split("_")[1]);
                if (
                    chipNum >= userShip.chip_level &&
                    !isDuplicateAbility(parsedAbility, parsedAbilities.chip)
                ) {
                    parsedAbilities.chip.push(parsedAbility);
                }
            }
        });
    });

    return parsedAbilities;
};

import DataService from "../services/DataService";

export const doesAbilityApplyToUserShip = (parsedAbility, userShip) => {
    let applyToShip = true;
    if (parsedAbility.ability.for_class_ids.length) {
        applyToShip = parsedAbility.ability.for_class_ids.includes(
            userShip.ship.ship_class.id_class
        );
    }

    if (applyToShip && !parsedAbility.meetsConditions) {
        applyToShip = false;
    }

    return applyToShip;
};

export const getParsedAbilitySlugPermutations = (parsedAbility) => {
    const ability = parsedAbility.ability;

    const slugs = [];

    if (ability.duration_type) {
        slugs.push(`duration--${ability.duration_type}-${ability.duration}`);
    }
    if (ability.repeat_type) {
        slugs.push(`repeat--${ability.repeat_type}-${ability.repeat}`);
    }

    if (ability.variants.length) {
        slugs.push(["variant", [...ability.variants]]);
    }

    if (ability.target_class_ids.length) {
        slugs.push(["target_class", [...ability.target_class_ids]]);
    }

    if (ability.weapon_classes.length) {
        slugs.push(["weapon_class", [...ability.weapon_classes]]);
    }

    if (ability.weapon_sizes.length) {
        slugs.push(["weapon_size", [...ability.weapon_sizes]]);
    }

    const slugsToPermutations = (permutations, slugs) => {
        if (!slugs.length) {
            return permutations;
        }

        const slug = slugs.shift();

        if (Array.isArray(slug)) {
            const [slugType, slugValues] = slug;

            if (permutations.length) {
                permutations = permutations.reduce((acc, perm) => {
                    slugValues.forEach((slugValue) => {
                        acc.push(perm + "|" + slugType + "--" + slugValue);
                    });

                    return acc;
                }, []);
            } else {
                slugValues.forEach((slugValue) => {
                    permutations.push(slugType + "--" + slugValue);
                });
            }
        } else if (typeof slug === "string") {
            if (permutations.length) {
                permutations = permutations.map((p) => {
                    return p + "|" + slug;
                });
            } else {
                permutations.push(slug);
            }
        }

        return slugsToPermutations(permutations, slugs);
    };

    return slugsToPermutations([], slugs);
};

export const getShipShipStrengthByType = (parsedAbility, userShip) => {
    if (
        parsedAbility.ability.type ===
        DataService.ABILITY_TYPES.INCREASE_WEAPON_DAMAGE
    ) {
        let shipWeaponStrength = userShip.ship.slotStrengths.weapon.total;

        if (parsedAbility.ability.weapon_sizes.length) {
            shipWeaponStrength = parsedAbility.ability.weapon_sizes.reduce(
                (total, weapon_size) => {
                    return (
                        total + userShip.ship.slotStrengths.weapon[weapon_size]
                    );
                },
                0
            );
        }

        return shipWeaponStrength;
    }

    return 1;
};

const getBaseStatObj = (parsedAbility, userShip, amount, slug) => {
    return {
        source: {
            ability: parsedAbility.ability,
            amount,
            id_user_ship: parsedAbility.userShip.id_user_ship,
            slug,
        },
        target: {
            id_user_ship: userShip.id_user_ship,
        },
        strength: getShipShipStrengthByType(parsedAbility, userShip),
    };
};

export const calcParsedAbilityBySlug = (
    parsedAbility,
    userShip,
    slug,
    totalStats,
    shipStats
) => {
    const ability = parsedAbility.ability;

    if (!totalStats[ability.type]) {
        totalStats[ability.type] = {};
    }

    if (!totalStats[ability.type][slug]) {
        totalStats[ability.type][slug] = {
            percent: [],
            number: [],
        };
    }

    if (!shipStats[userShip.id_user_ship]) {
        shipStats[userShip.id_user_ship] = {};
    }

    if (!shipStats[userShip.id_user_ship][ability.type]) {
        shipStats[userShip.id_user_ship][ability.type] = {};
    }

    if (!shipStats[userShip.id_user_ship][ability.type][slug]) {
        shipStats[userShip.id_user_ship][ability.type][slug] = {
            percent: [],
            number: [],
        };
    }

    if (ability.type === DataService.ABILITY_TYPES.INCREASE_WEAPON_DAMAGE) {
        ability.amounts.forEach((amount) => {
            const stat = getBaseStatObj(parsedAbility, userShip, amount, slug);

            if (amount.type === DataService.AMOUNT_TYPES.NUMBER) {
                stat.value = parseFloat(amount.value);

                totalStats[ability.type][slug].number.push(stat);
                shipStats[userShip.id_user_ship][ability.type][
                    slug
                ].number.push(stat);
            } else if (amount.type === DataService.AMOUNT_TYPES.PERCENT) {
                stat.value = parseFloat(amount.value);

                totalStats[ability.type][slug].percent.push(stat);
                shipStats[userShip.id_user_ship][ability.type][
                    slug
                ].percent.push(stat);
            }
        });
    } else if (ability.type === DataService.ABILITY_TYPES.REDUCE_DAMAGE) {
        ability.amounts.forEach((amount) => {
            const stat = getBaseStatObj(parsedAbility, userShip, amount, slug);

            if (amount.type === DataService.AMOUNT_TYPES.NUMBER) {
                stat.value = parseFloat(amount.value);

                totalStats[ability.type][slug].number.push(stat);
                shipStats[userShip.id_user_ship][ability.type][
                    slug
                ].number.push(stat);
            } else if (amount.type === DataService.AMOUNT_TYPES.PERCENT) {
                stat.value = parseFloat(amount.value);

                totalStats[ability.type][slug].percent.push(stat);
                shipStats[userShip.id_user_ship][ability.type][
                    slug
                ].percent.push(stat);
            }
        });
    }
};

export const getFleetParsedAbilityStats = (fleet) => {
    const totalStats = {};
    const shipStats = {};

    fleet.parsedAbilities.forEach((parsedAbility) => {
        fleet.user_ships.forEach((userShip) => {
            const appliesToShip = doesAbilityApplyToUserShip(
                parsedAbility,
                userShip
            );

            if (!appliesToShip) {
                return false;
            }

            const slugPermutations =
                getParsedAbilitySlugPermutations(parsedAbility);

            slugPermutations.forEach((slug) => {
                calcParsedAbilityBySlug(
                    parsedAbility,
                    userShip,
                    slug,
                    totalStats,
                    shipStats
                );
            });
        });
    });

    return { shipStats, totalStats };
};

export const getFleetsParsedAbilityStats = (fleets) => {
    return fleets.reduce((obj, fleet) => {
        const { totalStats, shipStats } = getFleetParsedAbilityStats(fleet);

        obj[fleet.id_workshop_fleet] = {
            totalStats,
            shipStats,
        };
        return obj;
    }, {});
};

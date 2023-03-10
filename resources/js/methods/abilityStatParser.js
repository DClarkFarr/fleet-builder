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

    if (ability.for_class_ids.length) {
        slugs.push(["for_class", [...ability.for_class_ids]]);
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

    return slugsToPermutations([], slugs.length ? slugs : ["all"]);
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
    } else if (
        parsedAbility.ability_type ===
            DataService.ABILITY_TYPES.REDUCE_DAMAGE &&
        (!parsedAbility.ability.variants.length ||
            parsedAbility.ability.variants.includes(
                DataService.RESISTANCE_TYPES.ARMOR
            ))
    ) {
        return userShip.ship.slotStrengths.armor.total;
    }

    return 1;
};

const getBaseStatObj = (parsedAbility, userShip, amount, slug) => {
    const ability = parsedAbility.ability;

    let target_class_ids = [];
    let variants = [];
    let for_class_ids = [];

    if (ability.target_class_ids.length) {
        const [, class_id] = slug.match(/target_class--(\d+)/);

        target_class_ids = [parseInt(class_id)];
    }

    if (ability.for_class_ids.length) {
        const [, class_id] = slug.match(/for_class--(\d+)/);

        for_class_ids = [parseInt(class_id)];
    }

    if (ability.variants.length) {
        const [, variant] = slug.match(/variant--([a-z]+)/);

        variants = [!isNaN(parseInt(variant)) ? parseInt(variant) : variant];
    }

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
        variants,
        target_class_ids,
        for_class_ids,
    };
};

export const setObjValueWhenEmpty = (obj, path, value) => {
    const pathArr = path.split(".");
    const lastPath = pathArr.pop();

    let currentObj = obj;
    pathArr.forEach((path) => {
        if (!currentObj[path]) {
            currentObj[path] = {};
        }

        currentObj = currentObj[path];
    });

    if (!currentObj[lastPath]) {
        currentObj[lastPath] = value;
    }
};

export const calcParsedAbilityBySlug = (
    parsedAbility,
    userShip,
    slug,
    totalStats,
    shipStats,
    abilityStats
) => {
    const ability = parsedAbility.ability;

    const intAmountTypes = [
        DataService.AMOUNT_TYPES.NUMBER,
        DataService.AMOUNT_TYPES.PERCENT,
        DataService.AMOUNT_TYPES.SECONDS,
        DataService.AMOUNT_TYPES.ATTACKS,
    ];

    ability.amounts.forEach((amount) => {
        setObjValueWhenEmpty(
            totalStats,
            `${ability.type}.${slug}.${amount.type}`,
            []
        );

        setObjValueWhenEmpty(
            shipStats,
            `${userShip.id_user_ship}.${ability.type}.${slug}.${amount.type}`,
            []
        );

        setObjValueWhenEmpty(
            abilityStats,
            `${ability.id_ability}.${slug}.${amount.type}`
        );

        const stat = getBaseStatObj(parsedAbility, userShip, amount, slug);

        if (intAmountTypes.includes(amount.type)) {
            stat.value = parseFloat(amount.value);

            totalStats[ability.type][slug][amount.type].push(stat);
            shipStats[userShip.id_user_ship][ability.type][slug][
                amount.type
            ].push(stat);
            abilityStats[ability.id_ability][slug][amount.type] = stat;
        } else if (amount.type === DataService.AMOUNT_TYPES.FORMULA) {
            stat.value = amount;

            totalStats[ability.type][slug][amount.type].push(stat);
            shipStats[userShip.id_user_ship][ability.type][slug][
                amount.type
            ].push(stat);
            abilityStats[ability.id_ability][slug][amount.type] = stat;
        } else {
            console.warn("Unknown amount type", amount.type, amount);
        }
    });
};

export const getFleetParsedAbilityStats = (fleet) => {
    const totalStats = {};
    const shipStats = {};
    const abilityStats = {};

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
                    shipStats,
                    abilityStats
                );
            });
        });
    });

    return { shipStats, totalStats, abilityStats };
};

export const getFleetsParsedAbilityStats = (fleets) => {
    return fleets.reduce((obj, fleet) => {
        const { totalStats, shipStats, abilityStats } =
            getFleetParsedAbilityStats(fleet);

        obj[fleet.id_workshop_fleet] = {
            totalStats,
            shipStats,
            abilityStats,
        };
        return obj;
    }, {});
};

export const sumFleetTotalStats = (fleet, parsedAbilityStats) => {
    const variantsByAbilityType = DataService.getVariantsByAbilityType();
    const rows = [];
    Object.entries(parsedAbilityStats).forEach(([abilityType, obj1]) => {
        Object.entries(obj1).forEach(([slug, obj2]) => {
            Object.entries(obj2).forEach(([amountType, arr]) => {
                if (!(arr && arr.length)) {
                    return console.log(
                        "no arr",
                        abilityType,
                        slug,
                        amountType,
                        arr
                    );
                }
                const row = arr.shift();

                const userShipIds = [row.target.id_user_ship];

                const abilityIds = [row.source.ability.id_ability];

                // const sourceShip = fleet.user_ships.find((userShip) => {
                //     return userShip.id_user_ship === row.source.id_user_ship;
                // });

                arr.forEach((r) => {
                    if (!userShipIds.includes(r.target.id_user_ship)) {
                        userShipIds.push(r.target.id_user_ship);
                    }

                    if (!abilityIds.includes(r.source.ability.id_ability)) {
                        abilityIds.push(r.source.ability.id_ability);
                    }
                });

                row.isVariantType = !!variantsByAbilityType[abilityType];
                row.target = userShipIds;
                row.amountType = amountType;
                row.abilityType = abilityType;
                row.slug = slug;

                if (
                    [
                        DataService.AMOUNT_TYPES.NUMBER,
                        DataService.AMOUNT_TYPES.PERCENT,
                        DataService.AMOUNT_TYPES.SECONDS,
                        DataService.AMOUNT_TYPES.ATTACKS,
                    ].includes(amountType)
                ) {
                    arr.forEach((r) => {
                        row.value += r.value;
                        row.strength += r.strength;
                    });

                    row.value /= userShipIds.length;
                    row.strength /= abilityIds.length;
                } else if (amountType === DataService.AMOUNT_TYPES.FORMULA) {
                    row.values = [row.value];
                    arr.forEach((r) => {
                        row.values.push(r.value);
                    });
                }

                rows.push(row);
            });
        });
    });

    return rows;
};

import { cloneDeep, flatten, pick, sum, uniq } from "lodash";
import DataService from "../services/DataService";
import {
    abilityHasQualifiers,
    getAbilityQualifiers,
    matchAbilityQualifiers,
} from "./abilityTextParser";

export const doesUserShipAbilityApplyToSelf = (parsedAbility, userShip) => {
    let applyToShip = true;
    if (parsedAbility.ability.for_class_ids.length) {
        applyToShip = parsedAbility.ability.for_class_ids.includes(
            userShip.ship.ship_class.id_class
        );
    }

    if (applyToShip && parsedAbility.ability.flagship_required) {
        applyToShip = false;
    }

    return applyToShip;
};

export const doesFleetAbilityApplyToUserShip = (parsedAbility, userShip) => {
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

export const getParsedAbilitySlugPermutations = (
    parsedAbility,
    { withConditions = false } = {}
) => {
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

    if (ability.conditions.length && withConditions) {
        slugs.push([
            "condition",
            [
                ...ability.conditions.map((c) => {
                    return `${c.type}-${c.select.join(",")}${c.operator}${
                        c.value
                    }`;
                }),
            ],
        ]);
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
        extra: parsedAbility.extra,
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

export const abilityHasFormula = (ability) => {
    return ability.amounts.some(
        (amount) => amount.type === DataService.AMOUNT_TYPES.FORMULA
    );
};

export const resolveFormulaChild = (userShip, child) => {
    if (child.type === DataService.FORMULA_ITEM_TYPES.COLUMN) {
        if (child.value === DataService.SHIP_COLUMNS.LEVEL) {
            return userShip.level;
        } else {
            return userShip.columns?.[child.value] || 0;
        }
    } else if (child.type === DataService.FORMULA_ITEM_TYPES.NUMBER) {
        return child.value;
    } else if (child.type === DataService.FORMULA_ITEM_TYPES.FORMULA) {
        return resolveFormulaChildren(userShip, child.children);
    }
};

export const resolveFormulaChildren = (userShip, children) => {
    const values = children.map((child) =>
        resolveFormulaChild(userShip, child)
    );

    let lastOperator = null;
    const resolved = values.reduce((total, value, i) => {
        const child = children[i];

        if (i === 0) {
            lastOperator = child.operator;
            return value;
        } else {
            if (lastOperator === DataService.FORMULA_ITEM_OPERATORS.ADD) {
                total += value;
            } else if (
                lastOperator === DataService.FORMULA_ITEM_OPERATORS.SUBTRACT
            ) {
                total -= value;
            } else if (
                lastOperator === DataService.FORMULA_ITEM_OPERATORS.MULTIPLY
            ) {
                total *= value;
            } else if (
                lastOperator === DataService.FORMULA_ITEM_OPERATORS.DIVIDE
            ) {
                total /= value;
            }

            lastOperator = child.operator;
            return total;
        }
    }, 0);

    return resolved;
};

export const resolveAbilityAmount = (userShip, amount) => {
    if (
        [
            DataService.AMOUNT_TYPES.NUMBER,
            DataService.AMOUNT_TYPES.SECONDS,
            DataService.AMOUNT_TYPES.ATTACKS,
        ].includes(amount.type)
    ) {
        // already a number
        return parseFloat(amount.value);
    } else if (amount.type === DataService.AMOUNT_TYPES.PERCENT) {
        // to decimal
        return parseFloat(amount.value) / 100;
    } else if (amount.type === DataService.AMOUNT_TYPES.FORMULA) {
        return resolveFormulaChildren(userShip, amount.children);
    }
};

export const calcShipParsedAbilityBySlug = (
    parsedAbility,
    userShip,
    slug,
    totalStats
) => {
    const ability = parsedAbility.ability;

    const resolvableTypes = [
        DataService.AMOUNT_TYPES.NUMBER,
        DataService.AMOUNT_TYPES.PERCENT,
        DataService.AMOUNT_TYPES.SECONDS,
        DataService.AMOUNT_TYPES.ATTACKS,
        DataService.AMOUNT_TYPES.FORMULA,
    ];

    ability.amounts.forEach((amount) => {
        setObjValueWhenEmpty(
            totalStats,
            `${ability.type}.${slug}.${amount.type}`,
            []
        );

        const stat = getBaseStatObj(parsedAbility, userShip, amount, slug);

        if (resolvableTypes.includes(amount.type)) {
            stat.value = resolveAbilityAmount(userShip, amount);

            totalStats[ability.type][slug][amount.type].push(stat);
        } else {
            console.warn("Unknown amount type", amount.type, amount);
        }
    });
};

export const getUserShipParsedAbilityStats = (userShip, flagship = false) => {
    const totalStats = {};

    userShip.parsedAbilities.forEach((parsedAbility) => {
        const appliesToShip = doesUserShipAbilityApplyToSelf(
            parsedAbility,
            userShip
        );

        if (appliesToShip === flagship) {
            return false;
        }

        const slugPermutations = getParsedAbilitySlugPermutations(
            parsedAbility,
            { withConditions: true }
        );

        slugPermutations.forEach((slug) => {
            calcShipParsedAbilityBySlug(
                parsedAbility,
                userShip,
                slug,
                totalStats
            );
        });
    });

    return { totalStats };
};

export const getFleetParsedAbilityStats = (fleet) => {
    const totalStats = {};
    const shipStats = {};
    const abilityStats = {};

    fleet.parsedAbilities.forEach((parsedAbility) => {
        fleet.user_ships.forEach((userShip) => {
            const appliesToShip = doesFleetAbilityApplyToUserShip(
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

export const augmentShipTotalStats = (totalStats) => {
    totalStats.forEach((stat) => {
        stat.stackedStatTotals = [];
        stat.stackedValue = stat.value;
    });

    const totalStatsWithQualifiers = totalStats.filter(
        (stat) => stat.hasQualifiers
    );

    const totalStatsWithoutQualifiers = totalStats.filter(
        (stat) => !stat.hasQualifiers
    );

    totalStatsWithQualifiers.forEach((stat) => {
        const abilityQualifiers = getAbilityQualifiers(stat.source.ability);

        stat.stackedStatTotals = totalStatsWithoutQualifiers
            .filter(
                (ms) =>
                    ms.abilityType === stat.abilityType &&
                    ms.amountType === stat.amountType &&
                    !stat.appliesToFleet
            )
            .filter((ms) => {
                return matchAbilityQualifiers(
                    ms.source.ability,
                    abilityQualifiers
                );
            });

        if (stat.stackedStatTotals.length) {
            stat.stackedStatTotals.forEach((stackedTotal) => {
                stat.stackedValue += stackedTotal.value;
            });
        }
    });
};

export const sumFleetTotalStats = (fleet, totalStats) => {
    const variantsByAbilityType = DataService.getVariantsByAbilityType();
    const rows = [];

    const toWorkOn = cloneDeep(totalStats);

    Object.entries(toWorkOn).forEach(([abilityType, obj1]) => {
        Object.entries(obj1).forEach(([slug, obj2]) => {
            Object.entries(obj2).forEach(([amountType, arr]) => {
                if (!(arr && arr.length)) {
                    return false;
                    // return console.log(
                    //     "no arr",
                    //     abilityType,
                    //     slug,
                    //     amountType,
                    //     arr
                    // );
                }

                const row = {
                    type: abilityType,
                    source: {
                        ability: arr[0].source.ability,
                        id_user_ship: arr[0].source.id_user_ship,
                        slug: arr[0].source.slug,
                        amounts: arr.map((r) => r.source.amount),
                        extra: arr[0].extra,
                    },
                    value: 0,
                    strength: 0,
                    values: [],
                    variants: [],
                    for_class_ids: uniq(
                        flatten(arr.map((r) => r.for_class_ids))
                    ),
                    target_class_ids: uniq(
                        flatten(arr.map((r) => r.target_class_ids))
                    ),
                    hasConditions: arr[0].source.ability.conditions.length > 0,
                    hasQualifiers: abilityHasQualifiers(arr[0].source.ability),
                    appliesToFleet: arr[0].source.ability.applies_to_fleet,
                };

                const userShipIds = uniq(arr.map((r) => r.target.id_user_ship));

                const abilityIds = uniq(
                    arr.map((r) => r.source.ability.id_ability)
                );

                arr.forEach((r) => {
                    if (!userShipIds.includes(r.target.id_user_ship)) {
                        userShipIds.push(r.target.id_user_ship);
                    }

                    if (!abilityIds.includes(r.source.ability.id_ability)) {
                        abilityIds.push(r.source.ability.id_ability);
                    }
                });

                row.isVariantType = !!variantsByAbilityType[abilityType];
                if (row.isVariantType) {
                    row.variants = arr[0].variants;
                }

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
                    row.values = [];
                    arr.forEach((r) => {
                        row.values.push(r.value);
                    });

                    row.value = row.value + sum(row.values);
                }

                rows.push(row);
            });
        });
    });

    return rows;
};

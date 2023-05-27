import { watch, toRaw } from "vue";
import DataService from "../services/DataService";
import pluralize from "pluralize";
import { upperFirst } from "lodash";

const typesByAffect = Object.entries(
    DataService.getAbilityTypesByAffect()
).reduce((obj, [key, vals]) => {
    vals.forEach((val) => {
        obj[val] = key;
    });
    return obj;
}, {});

const abilityTypes = DataService.getAbilityTypes();
const amountTypes = DataService.AMOUNT_TYPES;
const shipColumns = DataService.getShipColumns();

const numberFormatter = new Intl.NumberFormat();

const abilityAffects = DataService.getAbilityAffects();

export const parseNumber = (n) => {
    return numberFormatter.format(n);
};
export const parseAgainstClasses = (ability, { shipClasses }) => {
    if (!ability.target_class_ids.length) {
        return "";
    }

    const affectType = typesByAffect[ability.type];

    let prep = "against";
    if (affectType === DataService.ABILITY_AFFECTS.DEFENSE) {
        prep = "from";
    }

    const classNames = ability.target_class_ids
        .map((id) => {
            const name = shipClasses.find((c) => c.id_class === id)?.name;
            return name ? pluralize.plural(name) : false;
        })
        .filter((c) => !!c);

    return `${prep} enemy ${joinAnd(classNames)}`;
};

export const classIdsToNames = (classIds, { shipClasses }) => {
    return classIds
        .map((id) => {
            const name = shipClasses.find((c) => c.id_class === id)?.name;
            return name ? pluralize.plural(name) : false;
        })
        .filter((c) => !!c);
};

const parseForClasses = (ability, { shipClasses }) => {
    if (!ability.applies_to_fleet) {
        return "";
    }

    if (!ability.for_class_ids.length) {
        return "";
    }

    const classNames = ability.for_class_ids
        .map((id) => {
            const name = shipClasses.find((c) => c.id_class === id)?.name;
            return name ? pluralize.plural(name) : false;
        })
        .filter((c) => !!c);

    return `of ${joinAnd(classNames)} in fleet`;
};

export const parseFormulaAmountLine = (ability, amount) => {
    const blocks = [];
    buildItemBlocks(amount.children, blocks);

    return blocks
        .map((block) => {
            if (block.type === "open") {
                return "(";
            } else if (block.type === "close") {
                return ")";
            } else if (block.type === "item") {
                if (block.item.type === "column") {
                    return shipColumns.find((c) => c.slug === block.item.value)
                        .name;
                } else {
                    return block.item.value;
                }
            } else if (block.type === "operator") {
                return block.item.operator;
            }
        })
        .join(" ");
};

export const buildItemBlocks = (items, bs, depth = []) => {
    const lastIndex = items.length - 1;
    items.forEach((item, index) => {
        if (item.type === DataService.FORMULA_ITEM_TYPES.FORMULA) {
            bs.push({
                depth: [...depth, index],
                index: bs.length,
                type: "open",
                item,
            });
            buildItemBlocks(item.children, bs, [...depth, index]);
            bs.push({
                depth: [...depth, index],
                index: bs.length,
                type: "close",
                item,
            });
        } else {
            bs.push({
                depth: [...depth, index],
                index: bs.length,
                type: "item",
                item,
            });
        }

        if (lastIndex !== index) {
            bs.push({
                depth: [...depth, index],
                index: bs.length,
                item,
                type: "operator",
            });
        }
    });

    bs.push({
        type: "add",
        depth: [...depth],
        index: bs.length,
    });
};

export const parseAmountLine = (ability, amount) => {
    if (!amount?.type) {
        return "";
    }

    if (amount.type === amountTypes.FORMULA) {
        return parseText("X [{formula}]", {
            formula: parseFormulaAmountLine(ability, amount),
        });
    }
    const attack = pluralize("attack", parseInt(amount.value));
    const second = pluralize("second", parseInt(amount.value));

    const lines = {
        [amountTypes.NUMBER]: "{value}",
        [amountTypes.PERCENT]: "{value}%",
        [amountTypes.ATTACKS]: `{value} ${attack}`,
        [amountTypes.SECONDS]: `{value} ${second}`,
    };

    let value = parseNumber(amount.value);

    const line = lines[amount.type];

    return parseText(line, {
        value,
    });
};

export const parseAmount = (ability) => {
    if (!ability.amounts?.length) {
        return "";
    }

    const amounts = ability.amounts
        .map((amount) => {
            const parsedAmount = parseAmountLine(ability, amount);
            if (!parsedAmount) {
                return false;
            }
            return parsedAmount;
        })
        .filter((a) => !!a);

    const isMultiple = amounts.length > 1;

    const multipleOrSingle = {
        multiple: "({amount})",
        single: "{amount}",
    };

    const parsedAmounts = parseText(
        isMultiple ? multipleOrSingle.multiple : multipleOrSingle.single,
        {
            amount: amounts.join(" + "),
        }
    );

    return parsedAmounts;
};
const parseAmountDescription = (ability) => {
    const parsedAmounts = parseAmount(ability);

    const formatLines = {
        default: "by {parsedAmounts}",
        [DataService.ABILITY_TYPES.INCREASE_ATTACK_SPEED]: `by {parsedAmounts}`,
        [DataService.ABILITY_TYPES.EXTRA_ATTACK]: `does {parsedAmounts} damage`,
    };

    const formatLine = formatLines[ability.type] || formatLines.default;

    return parseText(formatLine, {
        parsedAmounts,
    });
};

export const joinAnd = (original) => {
    const arr = [...original];

    if (arr.length > 1) {
        const last = arr.pop();
        return arr.join(", ") + " and " + last;
    }
    return arr.join(", ");
};

const parseVariantDescription = (ability, location = "to") => {
    if (!ability.variants.length) {
        return "";
    }
    const lines = {
        to: "to {variants}",
    };

    const line = lines[location];

    return parseText(line, {
        variants: joinAnd(ability.variants),
    });
};

export const parseText = (str, pairs, fallback = "") => {
    const pattern = /\{\s*(\w+)\s*\}/gm;
    const r = str.matchAll(pattern);
    const values = [];

    let m;
    while ((m = r.next())) {
        if (m.done) break;
        values.push(m.value);
    }

    let parsed = str;

    values.forEach((v) => {
        const [full, slug] = v;
        const value = pairs[slug] || fallback;
        parsed = parsed.replace(full, value);
    });

    return parsed;
};

export const parseDurationDescription = (ability) => {
    if (!ability.duration_type) {
        return "";
    }

    const lines = {
        [DataService.DURATION_TYPES.ATTACKS]: "for the first {amount} attacks",
        [DataService.DURATION_TYPES.SECONDS]: "for the first {amount} seconds",
    };

    const line = lines[ability.duration_type];

    return parseText(line, {
        amount: ability.duration,
    });
};

export const parseRepeatDescription = (ability) => {
    if (!ability.repeat_type) {
        return "";
    }

    const lines = {
        [DataService.REPEAT_TYPES.ATTACKS]: "every {amount} attacks",
        [DataService.REPEAT_TYPES.SECONDS]: "every {amount} seconds",
    };

    const line = lines[ability.repeat_type];

    return parseText(line, {
        amount: ability.repeat,
    });
};

const parseCondition = (condition, { shipClasses }) => {
    if (condition.type === DataService.CONDITION_TYPES.id_class) {
        const operators = {
            [DataService.OPERATORS.EQUALS]: `there {verb} {number} {classes}`,
            [DataService.OPERATORS
                .GREATER]: `there {verb} at least {number} {classes}`,
            [DataService.OPERATORS
                .LESS]: `there {verb} less than {number} {classes}`,
        };

        const operatorLine = operators[condition.operator];
        const verb = condition.value === 1 ? "is" : "are";
        const number = condition.value;
        const classes = condition.select
            .map((id) => {
                const name = shipClasses.find((c) => c.id_class === id)?.name;
                return name ? pluralize.plural(name) : false;
            })
            .filter((c) => !!c);

        return parseText(operatorLine, {
            verb,
            number,
            classes: joinAnd(classes),
        });
    }

    return "";
};

const parseConditionsDescription = (ability, { shipClasses }) => {
    if (!ability.conditions.length) {
        return "";
    }

    const conditions = ability.conditions.map((c) => {
        return parseCondition(c, { shipClasses });
    });

    return `when ${joinAnd(conditions)} in your fleet`;
};

const parseWeaponsDescription = (ability) => {
    if (!ability.weapon_classes.length && !ability.weapon_sizes.length) {
        return "";
    }

    const sizePlural = pluralize("size", ability.weapon_sizes.length);

    const lines = {
        both: `(${sizePlural} {sizes} {classes} weapons)`,
        size: `(${sizePlural} {sizes} weapons)`,
        class: `({classes} weapons)`,
    };

    if (ability.weapon_classes.length && ability.weapon_sizes.length) {
        return parseText(lines.both, {
            sizes: joinAnd(ability.weapon_sizes.map((s) => s.toUpperCase())),
            classes: joinAnd(ability.weapon_classes),
        });
    } else if (ability.weapon_classes.length) {
        return parseText(lines.class, {
            classes: joinAnd(ability.weapon_classes),
        });
    } else if (ability.weapon_sizes.length) {
        return parseText(lines.size, {
            sizes: joinAnd(ability.weapon_sizes.map((s) => s.toUpperCase())),
        });
    }
};

export const abilityHasQualifiers = (ability, exclude = []) => {
    const toTest = [
        "for_class_ids",
        "target_class_ids",
        "weapon_classes",
        "weapon_sizes",
    ].filter((key) => !exclude.includes(key));

    return toTest.some((key) => ability[key].length > 0);
};

export const parseabilityQualifiers = (ability, { shipClasses }) => {
    const qualifiers = [];

    if (ability.target_class_ids.length) {
        const classes = ability.target_class_ids
            .map((id) => {
                const name = shipClasses.find((c) => c.id_class === id)?.name;
                return name ? pluralize.plural(name) : false;
            })
            .filter((c) => !!c);

        qualifiers.push(`Targets ${joinAnd(classes)}`);
    }

    if (ability.for_class_ids.length) {
        const classes = ability.for_class_ids
            .map((id) => {
                const name = shipClasses.find((c) => c.id_class === id)?.name;
                return name ? pluralize.plural(name) : false;
            })
            .filter((c) => !!c);

        qualifiers.push(`Boosts ${joinAnd(classes)}`);
    }

    if (ability.weapon_classes.length || ability.weapon_sizes.length) {
        const arr = [
            ...ability.weapon_classes,
            ...ability.weapon_sizes.map((s) => s.toUpperCase()),
        ];
        qualifiers.push(`Weapons ${joinAnd(arr)}`);
    }

    return qualifiers.join(" ");
};

export const getAbilityAffectType = (ability) => {
    return typesByAffect[ability.type];
};

export const getAbilityAffectTypeName = (ability) => {
    const found = abilityAffects.find(
        (aa) => aa.slug === getAbilityAffectType(ability)
    );
    return found?.name;
};

export const getAbilityTypeName = (ability) => {
    return abilityTypes.find((at) => at.slug === ability.type)?.name;
};

export const parseAbilityCategory = (ability) => {
    const categoryName = abilityTypes.find(
        (at) => at.slug === ability.type
    )?.category;

    if (
        ability.type === DataService.ABILITY_TYPES.REDUCE_DAMAGE &&
        ability.variants.length
    ) {
        return `${upperFirst(
            pluralize.singular(ability.variants[0])
        )} ${categoryName}`;
    } else if (
        ability.type === DataService.ABILITY_TYPES.INCREASE_PENETRATION &&
        ability.variants.length
    ) {
        return `${upperFirst(
            pluralize.singular(ability.variants[0])
        )} ${categoryName}`;
    } else if (
        ability.type === DataService.ABILITY_TYPES.INCREASE_WEAPON_DAMAGE &&
        ability.weapon_classes.length
    ) {
        return `${upperFirst(
            pluralize.singular(ability.weapon_classes[0])
        )} ${categoryName}`;
    } else if (
        ability.type === DataService.ABILITY_TYPES.INCREASE_WEAPON_DAMAGE &&
        ability.weapon_sizes.length
    ) {
        return `${upperFirst(
            pluralize.singular(ability.weapon_sizes[0])
        )} ${categoryName}`;
    }

    return categoryName;
};

class AbilityTextParser {
    constructor(ability, { shipClasses }, watchForUpdates = true) {
        this.shipClasses = shipClasses;

        if (watchForUpdates) {
            watch(
                ability,
                () => {
                    this.ability = toRaw(ability);
                },
                {
                    immediate: true,
                }
            );
        } else {
            this.ability = toRaw(ability);
        }
    }

    get affectType() {
        return getAbilityAffectType(this.ability);
    }

    get affectTypeName() {
        return getAbilityAffectTypeName(this.ability);
    }

    get abilityTypeCategory() {
        return parseAbilityCategory(this.ability);
    }

    get amountDescription() {
        return parseAmountDescription(this.ability);
    }

    get amount() {
        return parseAmount(this.ability);
    }

    get forClasses() {
        return parseForClasses(this.ability, {
            shipClasses: this.shipClasses,
        });
    }

    get toVariantDescription() {
        return parseVariantDescription(this.ability, "to");
    }

    get durationDescription() {
        return parseDurationDescription(this.ability);
    }

    get repeatDescription() {
        return parseRepeatDescription(this.ability);
    }

    get againstClasses() {
        return parseAgainstClasses(this.ability, {
            shipClasses: this.shipClasses,
        });
    }

    get conditionsDescription() {
        return parseConditionsDescription(this.ability, {
            shipClasses: this.shipClasses,
        });
    }

    get weaponsDescription() {
        return parseWeaponsDescription(this.ability);
    }

    get abilityQualifiers() {
        return parseabilityQualifiers(this.ability, {
            shipClasses: this.shipClasses,
        });
    }

    get abilityTypeName() {
        return getAbilityTypeName(this.ability);
    }

    get fullDescription() {
        const template =
            "{abilityTypeName} {weaponsDescription} {toVariantDescription} {forClasses} {amountDescription} {durationDescription} {repeatDescription} {againstClasses} {conditionsDescription}";

        const parsedText = parseText(template, {
            abilityTypeName: this.abilityTypeName,
            amountDescription: this.amountDescription,
            forClasses: this.forClasses,
            toVariantDescription: this.toVariantDescription,
            durationDescription: this.durationDescription,
            repeatDescription: this.repeatDescription,
            againstClasses: this.againstClasses,
            conditionsDescription: this.conditionsDescription,
            weaponsDescription: this.weaponsDescription,
        });

        return `${parsedText.replace(/\s{2,}/gm, " ").trim()}.`;
    }
}
export const getAbilityTextParser = (ability, data, watchForUpdates = true) => {
    const ap = new AbilityTextParser(ability, data, watchForUpdates);

    return ap;
};

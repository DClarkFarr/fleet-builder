import DataService from "../services/DataService";
import {
    joinAnd,
    parseAmountLine,
    parseText,
    parseNumber,
    parseAgainstClasses,
    parseAbilityCategory,
    parseDurationDescription,
    parseRepeatDescription,
    classIdsToNames,
    getAbilityAffectType,
    getAbilityAffectTypeName,
} from "./abilityTextParser";

import pluralize from "pluralize";

import { upperFirst } from "lodash";

const abilityTypes = DataService.getAbilityTypes();
const abilityLocations = DataService.getShipAbilityLocations();

export const summedFleetStatsTotalToText = (
    fleet,
    summedStatsTotal,
    { shipClasses }
) => {
    const ability = summedStatsTotal.source.ability;

    /**
     * Make description
     */
    const abilityName = abilityTypes.find((t) => t.slug === ability.type).name;

    const titlesByType = {
        default: "{abilityName}",
        [DataService.ABILITY_TYPES.INCREASE_WEAPON_DAMAGE]:
            "Increase {variants} Weapon Damage",
        [DataService.ABILITY_TYPES.REDUCE_DAMAGE]: "Reduce {variants} Damage",
        [DataService.ABILITY_TYPES.INCREASE_RESISTENCE]:
            "Increase {variants} Resistance",
        [DataService.ABILITY_TYPES.INCREASE_PENETRATION]:
            "Increase {variants} Penetration",
    };

    let title;
    if (summedStatsTotal.isVariantType) {
        const variants = ability.variants.length
            ? joinAnd(
                  summedStatsTotal.variants
                      .map(pluralize.singular)
                      .map(upperFirst)
              )
            : "All";
        title = parseText(titlesByType[ability.type], {
            abilityName,
            variants,
        });
    } else {
        title = parseText(titlesByType.default, {
            abilityName,
        });
    }

    const ships = ability.for_class_ids.length
        ? `${summedStatsTotal.target.length} ` +
          joinAnd(
              classIdsToNames(summedStatsTotal.for_class_ids, { shipClasses })
          )
        : pluralize("ship", summedStatsTotal.target.length, true);

    const shipCount = parseText(`of {ships}`, {
        ships,
    });

    const formatLines = {
        default: "by {parsedAmount}",
        [DataService.ABILITY_TYPES.INCREASE_ATTACK_SPEED]: `by {parsedAmount}`,
        [DataService.ABILITY_TYPES.EXTRA_ATTACK]: `does {parsedAmount} damage`,
    };

    let parsedAmount;
    if (summedStatsTotal.amountType === DataService.AMOUNT_TYPES.FORMULA) {
        parsedAmount = joinAnd(
            summedStatsTotal.values.map((amount) => {
                return parseAmountLine(ability, amount);
            })
        );
    } else {
        parsedAmount = parseAmountLine(ability, {
            type: summedStatsTotal.amountType,
            value: parseNumber(summedStatsTotal.value),
        });
    }

    const amount = parseText(
        formatLines[summedStatsTotal.amountType] || formatLines.default,
        {
            parsedAmount,
        }
    );

    let strength = "";

    if (summedStatsTotal.strength > summedStatsTotal.target.length) {
        strength = parseText("(affecting {strength} strength)", {
            strength: summedStatsTotal.strength,
        });
    }

    let against = "";

    if (ability.target_class_ids.length) {
        against = parseAgainstClasses(
            { ...ability, target_class_ids: summedStatsTotal.target_class_ids },
            { shipClasses }
        );
    }

    const duration = parseDurationDescription(ability);

    const repeat = parseRepeatDescription(ability);

    const descriptionTemplate =
        "{title} {shipCount} {amount} {strength} {against} {duration} {repeat}";

    const description = parseText(descriptionTemplate, {
        title,
        shipCount,
        amount,
        strength,
        against,
        duration,
        repeat,
    })
        .replace(/\s{2,}/gm, " ")
        .trim();

    /**
     * Make category
     */

    const category = parseAbilityCategory(ability);

    const affectType = getAbilityAffectType(ability);
    const affectTypeName = getAbilityAffectTypeName(ability);

    return {
        description,
        category,
        affectType,
        affectTypeName,
    };
};

export const summedStatsTotalToText = (summedStatsTotal, { shipClasses }) => {
    const ability = summedStatsTotal.source.ability;

    /**
     * Make description
     */
    const abilityName = abilityTypes.find((t) => t.slug === ability.type).name;

    const titlesByType = {
        default: "{abilityName}",
        [DataService.ABILITY_TYPES.INCREASE_WEAPON_DAMAGE]:
            "Increase {variants} Weapon Damage",
        [DataService.ABILITY_TYPES.REDUCE_DAMAGE]: "Reduce {variants} Damage",
        [DataService.ABILITY_TYPES.INCREASE_RESISTENCE]:
            "Increase {variants} Resistance",
        [DataService.ABILITY_TYPES.INCREASE_PENETRATION]:
            "Increase {variants} Penetration",
    };

    let title;
    if (summedStatsTotal.isVariantType) {
        const variants = ability.variants.length
            ? joinAnd(
                  summedStatsTotal.variants
                      .map(pluralize.singular)
                      .map(upperFirst)
              )
            : "All";
        title = parseText(titlesByType[ability.type], {
            abilityName,
            variants,
        });
    } else {
        title = parseText(titlesByType.default, {
            abilityName,
        });
    }

    const formatLines = {
        default: "by {parsedAmount}",
        [DataService.ABILITY_TYPES.INCREASE_ATTACK_SPEED]: `by {parsedAmount}`,
        [DataService.ABILITY_TYPES.EXTRA_ATTACK]: `does {parsedAmount} damage`,
    };

    let parsedAmount;
    if (summedStatsTotal.amountType === DataService.AMOUNT_TYPES.FORMULA) {
        parsedAmount = joinAnd(
            summedStatsTotal.values.map((amount) => {
                return parseAmountLine(ability, amount);
            })
        );
    } else {
        parsedAmount = parseAmountLine(ability, {
            type: summedStatsTotal.amountType,
            value: summedStatsTotal.value,
        });
    }

    const amount = parseText(
        formatLines[summedStatsTotal.amountType] || formatLines.default,
        {
            parsedAmount,
        }
    );

    let strength = "";

    if (summedStatsTotal.strength > summedStatsTotal.target.length) {
        strength = parseText("(affecting {strength} strength)", {
            strength: summedStatsTotal.strength,
        });
    }

    let against = "";

    if (ability.target_class_ids.length) {
        against = parseAgainstClasses(
            { ...ability, target_class_ids: summedStatsTotal.target_class_ids },
            { shipClasses }
        );
    }

    const duration = parseDurationDescription(ability);

    const repeat = parseRepeatDescription(ability);

    const descriptionTemplate =
        "{title} {amount} {strength} {against} {duration} {repeat}";

    const description = parseText(descriptionTemplate, {
        title,
        amount,
        strength,
        against,
        duration,
        repeat,
    })
        .replace(/\s{2,}/gm, " ")
        .trim();

    /**
     * Make category
     */

    const category = parseAbilityCategory(ability);

    const affectType = getAbilityAffectType(ability);
    const affectTypeName = getAbilityAffectTypeName(ability);

    return {
        description,
        category,
        affectType,
        affectTypeName,
    };
};

export default class DataService {
    static getSizes() {
        return ["s", "m", "l"];
    }

    static getSlotTypes() {
        return ["weapon", "armor", "unit"];
    }

    static SLOT_TYPES = {
        WEAPON: "weapon",
        ARMOR: "armor",
        UNIT: "unit",
    };
}

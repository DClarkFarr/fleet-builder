import apiClient from "./apiClient";

const cacheApiCall = (key, callback) => {
    if (!cacheApiCall.cache) {
        cacheApiCall.cache = {};
    }
    if (!cacheApiCall.cache[key]) {
        cacheApiCall.cache[key] = callback();
    }

    return cacheApiCall.cache[key];
};
class ShipService {
    static getShipClasses() {
        return cacheApiCall("shipClasses", () =>
            apiClient
                .get("/admin/ship/class")
                .then((response) => response.data.rows)
        );
    }

    static getShipLevels() {
        return cacheApiCall("shipLevels", () =>
            apiClient
                .get("/admin/ship/level")
                .then((response) => response.data.rows)
        );
    }

    static getShip(id_ship) {
        return apiClient
            .get(`/admin/ship/${id_ship}`)
            .then((response) => response.data.row);
    }

    static getShips({ public: isPublic = true } = {}) {
        return apiClient
            .get(`/admin/ship`, {
                params: {
                    public: isPublic,
                },
            })
            .then((response) => response.data.rows);
    }
}

export default ShipService;

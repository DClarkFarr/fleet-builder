import apiClient from "./ApiClient";

class ShipService {
    static getShipClasses() {
        return apiClient
            .get("/admin/ship/class")
            .then((response) => response.data.rows);
    }

    static getShipLevels() {
        return apiClient
            .get("/admin/ship/level")
            .then((response) => response.data.rows);
    }

    static getShip(id_ship) {
        return apiClient
            .get(`/admin/ship/${id_ship}`)
            .then((response) => response.data.row);
    }
}

export default ShipService;

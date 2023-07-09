import apiClient from "./apiClient";

class AdmiralService {
    static getAdmiral(id_admiral) {
        return apiClient
            .get(`/admin/admiral/${id_admiral}`)
            .then((response) => response.data.row);
    }

    static getAdmirals({ public: isPublic = true } = {}) {
        return apiClient
            .get(`/admin/admiral`, {
                params: {
                    public: isPublic,
                },
            })
            .then((response) => response.data.rows);
    }

    static createAdmiralSkill(id_admiral, location) {
        return apiClient
            .post(`/admin/admiral/${id_admiral}/skill`, {
                location,
            })
            .then(({ data }) => data.row);
    }
}

export default AdmiralService;

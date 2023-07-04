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
}

export default AdmiralService;

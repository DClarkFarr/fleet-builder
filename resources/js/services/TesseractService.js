import apiClient from "./apiClient";

export default class TesseractService {
    static getOptions() {
        return apiClient
            .get(`/admin/tesseract/options`)
            .then((response) => response.data.rows);
    }

    static getFile(filename) {
        return apiClient
            .get(`/admin/tesseract/file/${filename}`, {
                responseType: "blob",
            })
            .then((response) => response.data);
    }
}

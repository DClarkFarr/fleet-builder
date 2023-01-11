import { defineStore } from "pinia";
import { computed, ref } from "vue";
import apiClient from "../services/ApiClient";

const useBuilderStore = defineStore("builder", () => {
    const ships = ref([]);
    const isLoadingShips = ref(false);

    const shipClasses = ref([]);

    const loadShips = async () => {
        isLoadingShips.value = true;

        await apiClient.get("data/ships").then((response) => {
            ships.value = response.data.rows;
        });

        isLoadingShips.value = false;
    };

    const loadShipClasses = async () => {
        return apiClient.get("data/ships/classes").then((response) => {
            shipClasses.value = response.data.rows;
        });
    };

    return {
        isLoadingShips,
        ships,
        shipClasses,
        loadShips,
        loadShipClasses,
    };
});

export default useBuilderStore;

import { defineStore } from "pinia";
import { computed, ref } from "vue";
import apiClient from "../services/ApiClient";

const useBuilderStore = defineStore("builder", () => {
    const ships = ref([]);
    const isLoadingShips = ref(false);

    const loadShips = async () => {
        isLoadingShips.value = true;

        console.log("should be calling data/ships");
        await apiClient.get("data/ships").then((response) => {
            ships.value = response.data.rows;
        });

        isLoadingShips.value = false;
    };

    return {
        isLoadingShips,
        loadShips,
    };
});

export default useBuilderStore;

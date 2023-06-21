import { defineStore } from "pinia";
import { computed, ref } from "vue";
import apiClient from "../services/apiClient";

const useTesseractStore = defineStore("tesseract", () => {
    const boxlayer = new L.FeatureGroup();
    const drawControl = new L.Control.Draw({
        draw: {
            polygon: false,
            marker: false,
            circle: false,
            polyline: false,
            rectangle: true,
        },
        edit: {
            featureGroup: boxlayer,
            edit: false,
        },
    });

    const map = ref(null);

    const image = ref(null);

    const boxdata = ref([]);

    const initMap = (mapEl) => {
        map.value = new L.map(mapEl.id, {
            crs: L.CRS.Simple,
            minZoom: -5,
        });

        map.value.addControl(drawControl);
    };

    const resetImage = () => {
        if (image.value) {
            map.value.removeLayer(image.value);
        }
    };
    const loadImage = async (file) => {
        if (!file) {
            console.warn("No file selected");
            return Promise.resolve(false);
        }

        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = function () {
                const h = this.height;
                const w = this.width;
                const bounds = [
                    [0, 0],
                    [parseInt(h), parseInt(w)],
                ];
                const bounds2 = [
                    [h - 300, 0],
                    [h, w],
                ];

                console.log("bounds was", bounds, bounds2);

                if (image.value) {
                    resetImage();
                    map.value.fitBounds(bounds2);
                    image.value = new L.imageOverlay(img.src, bounds).addTo(
                        map.value
                    );
                } else {
                    map.value.fitBounds(bounds2);
                    image.value = new L.imageOverlay(img.src, bounds).addTo(
                        map.value
                    );
                }

                map.value.fitBounds(bounds2);

                resolve(true);
            };

            img.onerror = function () {
                reject("not a valid file: " + file.type);
            };
            img.src = URL.createObjectURL(file);
        });
    };

    const loadBoxData = async (selectedFile) => {
        var reader = new FileReader();
        // Read the file
        reader.readAsText(selectedFile);
        // When it's loaded, process it

        reader.onload = function processFile(e) {
            var file = e.target.result;

            if (file && file.length) {
                boxlayer.clearLayers();
                boxdata.value = [];

                file.split("\n").forEach(function (line) {
                    if (line.length > 5) {
                        var temp = line.split(" ");
                        var symbole = {
                            text: temp[0],
                            x1: parseInt(temp[1]),
                            y1: parseInt(temp[2]),
                            x2: parseInt(temp[3]),
                            y2: parseInt(temp[4]),
                        };

                        var rect = new L.rectangle([
                            [symbole.y1, symbole.x1],
                            [symbole.y2, symbole.x2],
                        ]);

                        rect.on("edit", editRect);
                        rect.on("click", onRectClick);
                        // addLayer

                        boxlayer.addLayer(rect);
                        var polyid = boxlayer.getLayerId(rect);
                        symbole.polyid = polyid;
                        boxdata.value.push(symbole);
                    }
                });

                map.value.addLayer(boxlayer);

                // select next BB
                var nextBB = getNextBB();
                fillAndFocusRect(nextBB);
            }
        };
    };

    const showFormRow = computed(() => {
        return boxdata.value.length > 0;
    });
    const hasImage = computed(() => {
        return image.value !== null;
    });

    return {
        initMap,
        loadImage,
        resetImage,
        image,
        boxdata,
        showFormRow,
        hasImage,
    };
});

export default useTesseractStore;

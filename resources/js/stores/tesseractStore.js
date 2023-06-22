import { defineStore } from "pinia";
import { computed, ref, reactive } from "vue";
import apiClient from "../services/apiClient";
import { debounce } from "lodash";

const useTesseractStore = defineStore("tesseract", () => {
    const doneMovingInterval = 200;
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

    let map = null;
    let image = null;
    let selectedBox = null;
    const selectedBoxRef = ref(null);
    let selectedPoly = null;
    let movingTimer = null;

    const boxdata = ref([]);
    const rects = ref([]);
    const listData = ref([]);

    const zoomMax = ref(1);

    const hasImage = ref(false);

    const form = reactive({
        file: "",
        boxfile: "",
        txt: "",
        y1: "",
        x1: "",
        y2: "",
        x2: "",
    });

    const initMap = (mapEl) => {
        map = new L.map(mapEl, {
            crs: L.CRS.Simple,
            minZoom: -5,
        });

        map.addControl(drawControl);

        map.on("draw:deleted", function (event) {
            // get boxdata
            Object.keys(event.layers._layers).forEach((x) => {
                var polyid = parseInt(x);
                var delbox = boxdata.value.find((x) => {
                    return x.polyid == polyid;
                });

                var delIndex = deleteBox(delbox);
                // if (delIndex > -1) {
                //     fillAndFocusRect(boxdata[delindex]);
                // }
            });
        });

        map.on(L.Draw.Event.CREATED, function (event) {
            var layer = event.layer;

            layer.on("edit", editRect);
            layer.on("click", onRectClick);

            // add new boxdata entry
            boxlayer.addLayer(layer);

            var newbb = {
                polyid: layer._leaflet_id,
                text: "",
                x1: Math.round(layer._latlngs[0][0].lng),
                y1: Math.round(layer._latlngs[0][0].lat),
                x2: Math.round(layer._latlngs[0][2].lng),
                y2: layer._latlngs[0][2].lat,
            };

            // get intdex of prebious
            var idx;
            if (selectedBox) {
                idx = boxdata.value.findIndex(function (x) {
                    return x.polyid == selectedBox.polyid;
                });
            } else {
                idx = 0;
            }
            // insert after
            boxdata.value.splice(idx + 1, 0, newbb);
            fillAndFocusRect(newbb);
        });
    };

    const resetImage = () => {
        if (image) {
            map.removeLayer(image);
            image = null;
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

                if (image) {
                    resetImage();
                    image = new L.imageOverlay(img.src, bounds).addTo(map);
                    hasImage.value = true;
                } else {
                    image = new L.imageOverlay(img.src, bounds).addTo(map);
                    hasImage.value = true;
                }

                map.fitBounds(bounds2);

                resolve(true);
            };

            img.onerror = function () {
                reject("not a valid file: " + file.type);
            };
            img.src = URL.createObjectURL(file);
        });
    };

    function getBoxdataFromRect(rect) {
        var firstel = boxdata.value.find(function (x) {
            return x.polyid == rect._leaflet_id;
        });
        return firstel;
    }
    function updateBoxdata(id, d) {
        var thebox = boxdata.value.findIndex(function (x) {
            return x.polyid == id;
        });
        var ndata = Object.assign({}, boxdata.value[thebox], d);
        boxdata.value[thebox] = ndata;
    }
    function getBoxdataFromId(id) {
        var firstel = boxdata.value.find(function (x) {
            return x.polyid == id;
        });
        return firstel;
    }

    function getListData(d) {
        var thebox = boxdata.value.findIndex(function (x) {
            return x.polyid == d.polyid;
        });

        var start = Math.max(thebox - 10, 0);
        var end = Math.min(thebox + 10, boxdata.value.length);

        return boxdata.value.slice(start, end);
    }

    function setFormFromBox(box) {
        selectedBox = box;
        selectedBoxRef.value = box;

        form.txt = box.text;

        form.x1 = box.x1;
        form.y1 = box.y1;
        form.x2 = box.x2;
        form.y2 = box.y2;

        $("#formtxt").focus();

        setListData(box);
    }

    const setListData = (box) => {
        const listwords = getListData(box);

        listData.value = listwords;
    };

    function removeStyle(rect) {
        if (rect) {
            rect.setStyle({ color: "blue", opacity: 0.5, fillOpacity: 0.1 });
        }
    }
    function disableEdit(rect) {
        if (selectedPoly && rect != selectedPoly) {
            selectedPoly.editing.disable();
        }
    }
    function setStyle(rect) {
        if (rect) {
            rect.setStyle({ color: "red", fillOpacity: 0 });
        }
    }
    function focusRect(id) {
        removeStyle(selectedPoly);
        var rect = boxlayer.getLayer(id);
        disableEdit(rect);
        var recb = rect.getBounds();
        map.fitBounds(recb, { maxZoom: zoomMax.value });
        // set style
        selectedPoly = rect;
        setStyle(rect);
        $("#formtxt").focus();
    }
    function fillAndFocusRect(box) {
        setFormFromBox(box);
        focusRect(box.polyid);
    }
    function editRect(e) {
        var layer = e.target;
        var box = getBoxdataFromRect(layer);
        var newd = {
            x1: Math.round(layer._latlngs[0][0].lng),
            y1: Math.round(layer._latlngs[0][0].lat),
            x2: Math.round(layer._latlngs[0][2].lng),
            y2: Math.round(layer._latlngs[0][2].lat),
        };

        updateBoxdata(layer._leaflet_id, newd);

        fillAndFocusRect(box);
    }
    function enableEdit(rect) {
        selectedPoly = rect;
        selectedPoly.editing.enable();
    }
    function onRectClick(event) {
        var rect = event.target;

        removeStyle(selectedPoly);
        map.fitBounds(rect.getBounds(), { maxZoom: zoomMax.value + 1 });
        setStyle(rect);
        disableEdit(rect);
        enableEdit(rect);

        // get boxdatata
        var bb = getBoxdataFromRect(rect);

        setFormFromBox(bb);
    }

    const resetBoxData = () => {
        boxlayer.clearLayers();
        boxdata.value = [];
        rects.value = [];
    };

    function getNextBB(box) {
        // Next
        if (typeof box === "undefined") {
            return boxdata.value[0];
        }
        var el = boxdata.value.findIndex(function (x) {
            return x.polyid == box.polyid;
        });
        if (el == boxdata.value.length) {
            return boxdata.value[el];
        }
        return boxdata.value[el + 1];
    }

    const loadBoxData = async (selectedFile) => {
        var reader = new FileReader();
        // Read the file
        reader.readAsText(selectedFile);
        // When it's loaded, process it

        reader.onload = function processFile(e) {
            var file = e.target.result;

            if (file && file.length) {
                resetBoxData();

                file.split("\n").forEach(function (line) {
                    if (line.length > 5) {
                        var temp = line.split(" ");
                        var symbol = {
                            text: temp[0],
                            x1: parseInt(temp[1]),
                            y1: parseInt(temp[2]),
                            x2: parseInt(temp[3]),
                            y2: parseInt(temp[4]),
                        };

                        var rect = new L.rectangle([
                            [symbol.y1, symbol.x1],
                            [symbol.y2, symbol.x2],
                        ]);

                        rect.on("edit", editRect);
                        rect.on("click", onRectClick);
                        // addLayer

                        boxlayer.addLayer(rect);
                        var polyid = boxlayer.getLayerId(rect);
                        symbol.polyid = polyid;
                        boxdata.value.push(symbol);
                        rects.value.push(rect);
                    }
                });

                map.addLayer(boxlayer);

                // select next BB
                var nextBB = getNextBB();
                fillAndFocusRect(nextBB);
            }
        };
    };

    const downloadBoxData = () => {
        var content = "";
        $.each(boxdata.value, function () {
            content =
                content +
                this.text +
                " " +
                this.x1 +
                " " +
                this.y1 +
                " " +
                this.x2 +
                " " +
                this.y2 +
                " 0\n";
        });

        window.open(
            "data:application/txt," + encodeURIComponent(content),
            "_self"
        );
    };

    function getPrevtBB(box) {
        // Next
        if (typeof box === "undefined") {
            return boxdata.value[0];
        }
        var el = boxdata.value.findIndex(function (x) {
            return x.polyid == box.polyid;
        });
        if (el === 0) {
            return boxdata.value[el];
        }
        return boxdata.value[el - 1];
    }

    const getNextAndFill = () => {
        var box = getNextBB(selectedBox);
        setFormFromBox(box);

        clearTimeout(movingTimer);
        movingTimer = setTimeout(focusRect, doneMovingInterval, box.polyid);
    };

    const getPrevAndFill = () => {
        var box = getPrevtBB(selectedBox);
        setFormFromBox(box);
        clearTimeout(movingTimer);
        movingTimer = setTimeout(focusRect, doneMovingInterval, box.polyid);
    };

    function updateRect(polyid, d) {
        var rect = boxlayer.getLayer(polyid);
        var newbounds = [
            [d.y1, d.x1],
            [d.y2, d.x2],
        ];
        rect.setBounds(newbounds);
    }

    const updateBoxFromForm = () => {
        var polyid = selectedBox.polyid;

        var newdata = {
            text: form.txt,
            x1: parseInt(form.x1),
            y1: parseInt(form.y1),
            x2: parseInt(form.x2),
            y2: parseInt(form.y2),
        };
        updateBoxdata(polyid, newdata);
        updateRect(polyid, newdata);
        // fillAndFocusRect(getNextBB(selectedBox));
    };

    const debounceUpdateBoxFromForm = debounce(
        updateBoxFromForm,
        doneMovingInterval
    );

    const showFormRow = computed(() => {
        return boxdata.value.length > 0;
    });

    return {
        initMap,
        loadImage,
        resetImage,
        loadBoxData,
        resetBoxData,
        downloadBoxData,
        getNextAndFill,
        getPrevAndFill,
        updateBoxFromForm,
        fillAndFocusRect,
        debounceUpdateBoxFromForm,
        image,
        boxdata,
        showFormRow,
        hasImage,
        form,
        listData,
        selectedBoxRef,
    };
});

export default useTesseractStore;

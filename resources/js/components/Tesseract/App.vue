<script setup>
import { onMounted, ref } from "vue";
import useTesseract from "../../stores/tesseractStore";

const ts = useTesseract();

const mapid = ref(null);

const onSelectImage = (e) => {
    const file = e.target.files?.[0] || null;
    if (file) {
        ts.loadImage(file);
    } else {
        ts.removeImage();
    }
};

const onSelectBox = (e) => {
    const file = e.target.files?.[0] || null;

    if (file) {
    } else {
    }
};

onMounted(() => {
    ts.initMap(mapid.value);
});
</script>

<template>
    <div class="tesseract px-4" :class="{ 'tesseract--image': ts.hasImage }">
        <nav class="navbar navbar-default">
            <div class="mb-4">
                <div class="navbar-header">
                    <a class="text-lg font-semibold" href="#">
                        Tesseract OCR boxfile web editor
                    </a>
                </div>
            </div>
        </nav>

        <div class="mb-4">
            <form class="flex gap-x-4">
                <div class="form-group">
                    <label for="file">Image:</label>
                    <input
                        class="form-control"
                        type="file"
                        id="file"
                        name="file"
                        @change="onSelectImage"
                    />
                </div>
                <div class="form-group">
                    <label for="boxfile">Box file:</label>
                    <input
                        class="form-control"
                        type="file"
                        id="boxfile"
                        name="boxfile"
                        @change="onSelectBox"
                    />
                </div>
            </form>
        </div>
        <div class="mb-4">
            <div class="maprow" ref="mapid" id="mapid"></div>
        </div>

        <div class="mb-4">
            <div class="flex justify-center">
                <p id="wordlist"></p>
            </div>
        </div>
        <div
            id="formrow"
            class="mb-4 flex gap-x-4 formrow"
            v-show="ts.showFormRow"
        >
            <div class="w-1/3">
                <form class="form-horizontal" id="updateTxt">
                    <div class="form-group">
                        <label
                            class="col-sm-2 control-label"
                            for="formtxt"
                            id="txtlabel"
                            >Text</label
                        >
                        <div class="col-sm-10">
                            <input
                                type="text"
                                id="formtxt"
                                boxid=""
                                name="txt"
                                class="form-control input-lg"
                                value=""
                            />
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-sm-offset-2 col-sm-10">
                            <button type="submit" class="btn btn-default">
                                Update
                            </button>
                        </div>
                    </div>
                </form>
                <form class="form-horizontal" id="formbox">
                    <div class="form-group">
                        <label
                            class="col-sm-2 control-label"
                            for="y1"
                            id="y1label"
                            >Y1</label
                        >
                        <div class="col-sm-6">
                            <input
                                type="number"
                                id="y1"
                                name="y1"
                                class="form-control input-lg"
                                value=""
                            />
                        </div>
                        <div class="col-ms-4"></div>
                    </div>

                    <div class="form-group">
                        <label
                            class="col-sm-2 control-label"
                            for="x1"
                            id="x1label"
                            >X1</label
                        >
                        <div class="col-sm-6">
                            <input
                                type="number"
                                id="x1"
                                name="x1"
                                class="form-control input-lg"
                                value=""
                            />
                            <!--           number -->
                        </div>
                        <div class="col-ms-4"></div>
                    </div>
                    <div class="form-group">
                        <label
                            class="col-sm-2 control-label"
                            for="y2"
                            id="y2label"
                            >Y2</label
                        >
                        <div class="col-sm-6">
                            <input
                                type="number"
                                id="y2"
                                name="y2"
                                class="form-control input-lg"
                                value=""
                            />
                            <!--           number -->
                        </div>
                        <div class="col-ms-4"></div>
                    </div>
                    <div class="form-group">
                        <label
                            class="col-sm-2 control-label"
                            for="x2"
                            id="x2label"
                            >X2</label
                        >
                        <div class="col-sm-6">
                            <input
                                type="number"
                                id="x2"
                                name="x2"
                                class="form-control input-lg"
                                value=""
                            />
                            <!--           number -->
                        </div>
                        <div class="col-ms-4"></div>
                    </div>
                </form>
            </div>
            <div class="w-1/3">
                <button id="previousBB" class="btn btn-default">
                    Previous
                </button>
                <button id="nextBB" class="btn btn-default">Next</button>
                <br />
                <br />
                <button id="downloadBtn" class="btn bt.default">
                    Download
                </button>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.tesseract {
    &--image {
        :deep(.leaflet-image-layer) {
            display: block;
        }
    }
}
</style>

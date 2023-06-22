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
        ts.loadBoxData(file);
    } else {
        ts.resetBoxData();
    }
};

const onClickDownload = () => {
    ts.downloadBoxData();
};

const onClickNext = () => {
    ts.getNextAndFill();
};

const onClickPrev = () => {
    ts.getPrevAndFill();
};

const onUpdateText = () => {
    ts.updateBoxFromForm();
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
                <div class="mb-4">
                    <label for="file">Image:</label>
                    <input
                        class="form-control"
                        type="file"
                        id="file"
                        name="file"
                        @change="onSelectImage"
                    />
                </div>
                <div class="mb-4">
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
            <div class="flex gap-x-3 items-center justify-center">
                <div>
                    <button
                        id="previousBB"
                        class="btn bg-gray-600"
                        @click="onClickPrev"
                    >
                        Previous
                    </button>
                </div>

                <div class="flex gap-x-2">
                    <div v-for="(word, i) in ts.listData" :key="i">
                        <a
                            @click="ts.fillAndFocusRect(word)"
                            :class="{
                                'text-sky-500':
                                    word.polyid === ts.selectedBoxRef.polyid,
                                'text-gray-500 cursor-pointer':
                                    word.polyid !== ts.selectedBoxRef.polyid,
                            }"
                        >
                            {{ word.text }}
                        </a>
                    </div>
                </div>
                <div>
                    <button
                        id="nextBB"
                        class="btn bg-gray-600"
                        @click="onClickNext"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
        <div class="mb-4" v-show="ts.showFormRow">
            <form class="mb-4" id="updateTxt" @submit.prevent="onUpdateText">
                <div class="mb-4 flex gap-x-4">
                    <div class="">
                        <label for="formtxt"> Text </label>
                        <input
                            type="text"
                            class="form-control input-lg"
                            v-model="ts.form.txt"
                        />
                    </div>
                    <div class="">
                        <div>
                            <label for="">&nbsp;</label>
                        </div>
                        <button type="submit" class="btn bg-gray-600">
                            Update
                        </button>
                    </div>
                </div>
            </form>
            <form class="mb-4" id="formbox">
                <div class="mb-4">
                    <label class="col-sm-2 control-label" for="y1" id="y1label">
                        Y1
                    </label>
                    <div class="col-sm-6">
                        <input
                            type="number"
                            id="y1"
                            class="form-control input-lg"
                            v-model="ts.form.y1"
                            @change="ts.debounceUpdateBoxFromForm"
                        />
                    </div>
                </div>

                <div class="mb-4">
                    <label class="col-sm-2 control-label" for="x1" id="x1label">
                        X1
                    </label>
                    <div class="col-sm-6">
                        <input
                            type="number"
                            id="x1"
                            class="form-control input-lg"
                            v-model="ts.form.x1"
                            @change="ts.debounceUpdateBoxFromForm"
                        />
                    </div>
                    <div class="col-ms-4"></div>
                </div>
                <div class="mb-4">
                    <label class="col-sm-2 control-label" for="y2" id="y2label">
                        Y2
                    </label>
                    <div class="col-sm-6">
                        <input
                            type="number"
                            id="y2"
                            class="form-control input-lg"
                            v-model="ts.form.y2"
                            @change="ts.debounceUpdateBoxFromForm"
                        />
                    </div>
                </div>
                <div class="mb-4">
                    <label class="col-sm-2 control-label" for="x2" id="x2label">
                        X2
                    </label>
                    <div class="col-sm-6">
                        <input
                            type="number"
                            id="x2"
                            class="form-control input-lg"
                            v-model="ts.form.x2"
                            @change="ts.debounceUpdateBoxFromForm"
                        />
                    </div>
                </div>
            </form>
            <button
                id="downloadBtn"
                @click="onClickDownload"
                class="btn bg-gray-600"
            >
                Download
            </button>
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

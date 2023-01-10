<script setup></script>

<template>
    <div class="content-box p-3">
        <div class="content-box__top flex">
            <div class="shrink">
                <div class="content-box__tick modal__tick"></div>
            </div>
            <div class="grow"></div>
            <div class="shrink">
                <div class="content-box__tick modal__tick"></div>
            </div>
        </div>

        <div
            class="content-box__body modal-border bg-modal-content/25 py-3 px-3 text-modal-text m-4"
        >
            <slot> </slot>
        </div>

        <div class="content-box__bottom flex">
            <div class="shrink">
                <div class="content-box__tick modal__tick"></div>
            </div>
            <div class="grow"></div>
            <div class="shrink">
                <div class="content-box__tick modal__tick"></div>
            </div>
        </div>
    </div>
</template>

<style lang="less">
.content-box {
    &__body {
        box-shadow: inset 0 0 7px 0px #61656e;
    }

    &__tick {
        width: 10px;
        height: 2px;
    }
}
</style>

<template>
    <div v-if="isLoading">
        <div class="w-100 d-flex justify-content-center">
            <div class="spinner spinner-border fs-3" role="status"></div>
        </div>
        <h3 class="mt-5" v-if="loadingText">{{ loadingText }}</h3>
    </div>
</template>

<script setup lang="ts">
interface Props {
    isLoading: boolean;
    loadingText?: string;
}
defineProps<Props>();
</script>

<style scoped>
.spinner {
    width: 2.5em;
    height: 2.5em;
}
</style>

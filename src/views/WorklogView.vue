<template>
    <div>
        <SpinnerComponent :is-loading="loading" loading-text="Fetching worklogs..." />
        <div v-if="!loading" class="w-100">
            <WorklogTableComponent :worklog-collections="worklogCollections" />
        </div>
    </div>
</template>

<script setup lang="ts">
import WorklogService from "@/worklogService";
import { type Ref, ref, onMounted } from "vue";
import SpinnerComponent from "@/components/SpinnerComponent.vue";
import WorklogTableComponent from "@/components/WorklogTableComponent.vue";
import type WorklogCollection from "@/models/worklogCollection";

const creationModelVisible = ref(false);
const worklogCollections: Ref<WorklogCollection[]> = ref([]);

const loading = ref(true);

onMounted(async () => {
    worklogCollections.value = (await WorklogService.fetchIssuesByJQL()) ?? [];
    loading.value = false;
});
</script>

<style>
.sticky-header {
    position: sticky;
    top: 0;
}
.small-col {
    width: 75px;
}
.issue-col {
    width: 500px;
}
#app {
    background-color: #212529 !important;
}
</style>

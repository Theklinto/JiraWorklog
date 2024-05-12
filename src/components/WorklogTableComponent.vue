<template>
    <div>
        <table class="table table-bordered table-striped table-dark">
            <thead class="sticky-header table-dark">
                <tr>
                    <th class="issue-col"></th>
                    <th class="issue-col"></th>
                    <th class="small-col" v-for="day in dateColumns" :key="day.getTime()">
                        {{ getDayName(day) + " " + getDate(day).split(" ")[0] }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <!-- <tr
                    v-for="worklogCollection in worklogCollections"
                    :key="worklogCollection.collectionId"
                >
                    <td>Test</td>
                </tr> -->
                <CollectionRowTableComponent
                    v-for="worklogCollection in worklogCollections"
                    :worklog-collection="worklogCollection"
                    :key="worklogCollection.collectionId"
                    :date-columns="dateColumns"
                />
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import type WorklogCollection from "@/models/worklogCollection";
import { getComparableDate, getDate, getDayName } from "@/utils/dateUtils";
import { onBeforeMount, onMounted, ref, type Ref } from "vue";
import CollectionRowTableComponent from "./CollectionRowTableComponent.vue";

interface Props {
    worklogCollections: WorklogCollection[];
}

const props = defineProps<Props>();
const dateColumns: Ref<Date[]> = ref([]);

onBeforeMount(() => {
    dateColumns.value = getDatesFromCollections(props.worklogCollections);
});

function getDatesFromCollections(worklogCollections: WorklogCollection[]): Date[] {
    const dates = worklogCollections
        .flatMap<Date | undefined>((collection) => {
            return collection.worklogs.map<Date | undefined>((worklog) => {
                return worklog.started ? getComparableDate(worklog.started) : undefined;
            });
        })
        .filter<Date>(
            (val, index, array): val is Date =>
                array.findIndex((d) => d?.getTime() === val?.getTime()) === index
        );
    //Mutates array
    dates.sort((a, b) => a.getTime() - b.getTime());

    return dates;
}
</script>

<style scoped></style>

<template>
    <tr v-for="(row, index) in rows" :key="localCollection.collectionId + row.worklog.id">
        <td :rowspan="rows.length" v-if="index === 0">
            {{ localCollection.collectionKey }}: {{ localCollection.collectionSummary }}
        </td>
        <td>
            {{ getWorklogComment(row.worklog) }}
        </td>
        <td v-for="date in dateColumns" :key="row.worklog.id ?? '' + date.getTime()">
            {{
                row.dayLogs.get(date.getTime())
                    ? WorklogCollection.getTimeSpentDisplayString(
                          row.dayLogs.get(date.getTime()) ?? 0
                      )
                    : ""
            }}
        </td>
    </tr>
</template>

<script setup lang="ts">
import { Worklog } from "@/models/jira/jiraModels";
import WorklogCollection from "@/models/worklogCollection";
import { getComparableDate, sameDay } from "@/utils/dateUtils";
import { v4 as uuidv4 } from "uuid";
import { type Ref, ref, onBeforeMount } from "vue";

interface Props {
    dateColumns: Date[];
    worklogCollection: WorklogCollection;
}

const props = defineProps<Props>();
const localCollection: Ref<WorklogCollection> = ref(new WorklogCollection());
const rows: Ref<WorklogRow[]> = ref([]);

class WorklogRow {
    constructor(worklog: Worklog) {
        this.worklog = worklog;
    }
    worklog: Worklog;
    dayLogs: Map<number, number> = new Map<number, number>();
}

onBeforeMount(() => {
    localCollection.value = props.worklogCollection;
    squashNoCommentWorklogsForSameDay(localCollection.value);
    setSameIdOnUncommentedWorklogs(localCollection.value);
    rows.value = makeWorklogRows(localCollection.value);
});

function squashNoCommentWorklogsForSameDay(worklogCollection: WorklogCollection): void {
    const newWorklogs: Worklog[] = [];
    props.dateColumns.forEach((date) => {
        let squashedWorklog: Worklog | undefined;
        worklogCollection.worklogs
            .filter((worklog) => worklog.started && sameDay(new Date(worklog.started), date))
            .forEach((worklog) => {
                if (getWorklogComment(worklog)) {
                    newWorklogs.push(worklog);
                } else {
                    if (squashedWorklog === undefined) {
                        squashedWorklog = worklog;
                    } else {
                        squashedWorklog.timeSpentSeconds =
                            (squashedWorklog.timeSpentSeconds ?? 0) +
                            (worklog.timeSpentSeconds ?? 0);
                    }
                }
            });
        if (squashedWorklog?.timeSpentSeconds) {
            newWorklogs.push(squashedWorklog);
            squashedWorklog = undefined;
        }
    });
    worklogCollection.worklogs = newWorklogs;
}

function setSameIdOnUncommentedWorklogs(worklogCollection: WorklogCollection): void {
    const newId = uuidv4();
    worklogCollection.worklogs.forEach((worklog) => {
        if (!getWorklogComment(worklog)) {
            worklog.id = newId;
        }
    });
}

function makeWorklogRows(worklogCollection: WorklogCollection): WorklogRow[] {
    const rows: WorklogRow[] = [];
    worklogCollection.worklogs.forEach((worklog) => {
        if (worklog.id && worklog.started) {
            const existingRowIndex = rows.findIndex((x) => x.worklog.id === worklog.id);
            let row: WorklogRow;
            if (existingRowIndex >= 0) {
                row = rows[existingRowIndex];
            } else {
                row = new WorklogRow(worklog);
                rows.push(row);
            }
            const date = getComparableDate(worklog.started);
            const timeInSeconds =
                (row.dayLogs.get(date.getTime()) ?? 0) + (worklog.timeSpentSeconds ?? 0);
            row.dayLogs.set(date.getTime(), timeInSeconds);
        }
    });

    console.log("rows", rows);
    return rows;
}

function getWorklogComment(worklog: Worklog): string | undefined {
    return worklog.comment?.content
        ?.flatMap((x) => x.content?.map((y) => y.text))
        .join(". ")
        .trim();
}
</script>
<style scoped></style>

<template>
    <div>
        <SpinnerComponent :is-loading="loading" loading-text="Fetching worklogs..." />
        <table v-if="!loading" class="table table-bordered table-striped table-dark">
            <thead class="sticky-header table-dark">
                <tr>
                    <th class="issue-col">Issue</th>
                    <th
                        class="small-col"
                        v-for="day in overview.days"
                        :key="'header:' + day.displayDate"
                    >
                        {{ day.weekdayName + " " + day.displayDate.split(" ")[0] }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="{ summary, key } in overview.issues" :key="key">
                    <td>
                        <a
                            :href="`https://swecodk-products.atlassian.net/browse/${key}`"
                            target="_blank"
                            >{{ key }}</a
                        >:<br />{{ summary }}
                    </td>
                    <td v-for="day in overview.days" :key="'row:' + day.displayDate">
                        {{ getTimeSpentDisplayString(day.worklogs[key]?.timeSpentSeconds ?? 0) }}
                    </td>
                </tr>
                <tr v-if="false">
                    <td colspan="100">
                        <button
                            disabled
                            title="Currently in development"
                            class="btn btn-primary w-100"
                        >
                            Add custom worklog
                        </button>
                    </td>
                </tr>
                <tr>
                    <td>Sum</td>
                    <td v-for="day in overview.days" :key="'sum:' + day.displayDate">
                        {{ getTimeSpentDisplayString(day.worklogSumInSeconds) }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import WorklogService from "@/worklogService";
import { type Ref, ref, onMounted } from "vue";
import { Issue } from "@/models/jira/jiraModels";
import { CalenderOverviewModel } from "@/models/calenderOverviewModel";
import SpinnerComponent from "@/components/SpinnerComponent.vue";

const timespanInDays = 14;
const issues: Ref<Issue[]> = ref([]);
const overview = ref(new CalenderOverviewModel(timespanInDays));

const loading = ref(true);

onMounted(async () => {
    issues.value = (await WorklogService.fetchIssuesByJQL()) ?? [];
    overview.value = groupByDay(issues.value);
    loading.value = false;
    console.log("Overview", overview.value);
});

function groupByDay(issues: Issue[]): CalenderOverviewModel {
    //reset
    const overview = new CalenderOverviewModel(timespanInDays);

    issues.forEach((issue) => {
        console.log("Looping issue", issue);
        if (issue.fields?.worklog && issue.fields.worklog.worklogs?.length) {
            issue.fields.worklog.worklogs.forEach((worklog) => {
                console.log("looping worklog", worklog);
                if (worklog.started && issue.key)
                    overview.addWorklogEntry(
                        new Date(worklog.started),
                        { summary: issue.fields?.summary ?? "", key: issue.key },
                        worklog
                    );
            });
        }
    });

    return overview;
}

function getTimeSpentDisplayString(timeSpentSeconds: number): string {
    if (timeSpentSeconds <= 0) {
        return "";
    }

    const timeSpentMinutes = timeSpentSeconds / 60;
    const minutesOutsideHours = timeSpentMinutes % 60;
    const hours: number =
        timeSpentMinutes >= 60 ? (timeSpentMinutes - minutesOutsideHours) / 60 : 0;

    return (
        (hours > 0 ? `${hours}h` : "") + (minutesOutsideHours > 0 ? ` ${minutesOutsideHours}m` : "")
    );
}
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

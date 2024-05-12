import type { Worklog } from "@/models/jira/jiraModels";

export default class WorklogCollection {
    collectionId: string = "";
    collectionKey: string = "";
    collectionSummary: string = "";
    worklogs: Worklog[] = [];
    persistantCollection: boolean = false;

    static getTimeSpentDisplayString(timeSpentSeconds: number): string {
        if (timeSpentSeconds <= 0) {
            return "";
        }

        const timeSpentMinutes = timeSpentSeconds / 60;
        const minutesOutsideHours = timeSpentMinutes % 60;
        const hours: number =
            timeSpentMinutes >= 60 ? (timeSpentMinutes - minutesOutsideHours) / 60 : 0;

        return (
            (hours > 0 ? `${hours}h` : "") +
            (minutesOutsideHours > 0 ? ` ${minutesOutsideHours}m` : "")
        );
    }
}

import type { Worklog } from "./jira/jiraModels";

export class CalenderOverviewModel {
    constructor(timespanInDays: number) {
        this.minimumDate = new Date();
        this.minimumDate.setDate(new Date().getDate() - timespanInDays);
        this.minimumDate.setHours(0, 0, 0, 0);
    }

    minimumDate: Date;
    issues: { summary: string; key: string }[] = [];
    days: DayOverviewModel[] = [];

    addWorklogEntry(date: Date, issue: { summary: string; key: string }, worklog: Worklog) {
        if (worklog.started && new Date(worklog.started) <= this.minimumDate) {
            return;
        }

        if (this.issues.find((x) => x.key == issue.key) === undefined) {
            this.issues.push(issue);
        }

        let day = this.days.find((day) => DateUtils.sameDay(day.date, date));
        if (day !== undefined) {
            day.addWorklog(issue.key, worklog);
        } else {
            day = new DayOverviewModel(date);
            day.addWorklog(issue.key, worklog);
            this.days.push(day);

            //Sort days (mutates the original array)
            this.days.sort((a, b) => a.date.getTime() - b.date.getTime());
        }
    }
}

export class DayOverviewModel {
    constructor(date: Date) {
        this.displayDate = DateUtils.getDate(date);
        this.weekdayName = DateUtils.getDayName(date);
        this.date = date;
    }

    date: Date;
    displayDate: string;
    weekdayName: string;
    private _worklogs: { [issueKey: string]: Worklog } = {};

    get worklogs() {
        return this._worklogs;
    }

    get worklogSumInSeconds(): number {
        let sum: number = 0;
        Object.keys(this._worklogs).forEach((key) => {
            sum += this._worklogs[key].timeSpentSeconds ?? 0;
        });
        return sum;
    }

    addWorklog(issueKey: string, worklog: Worklog) {
        const existingIssueEntry = this._worklogs[issueKey];
        if (existingIssueEntry) {
            existingIssueEntry.timeSpentSeconds =
                (existingIssueEntry.timeSpentSeconds ?? 0) + (worklog.timeSpentSeconds ?? 0);
        } else {
            this._worklogs[issueKey] = worklog;
        }
    }
}

class DateUtils {
    static getDate(date: Date) {
        return date.toLocaleTimeString("da-dk", { day: "2-digit", month: "2-digit" });
    }
    static getDayName(date: Date) {
        const weekday = date.toLocaleDateString("da-dk", { weekday: "long" });
        return weekday[0].toLocaleUpperCase() + weekday.slice(1);
    }
    static sameDay(day1: Date, day2: Date): boolean {
        return (
            day1.getUTCFullYear() == day2.getUTCFullYear() &&
            day1.getUTCMonth() == day2.getUTCMonth() &&
            day1.getUTCDate() == day2.getUTCDate()
        );
    }
}

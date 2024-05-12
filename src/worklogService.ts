import { MessagingService } from "@/messagingService";
import FetchService from "./fetchService";
import { Worklog, type Issue } from "./models/jira/jiraModels";
import type IssuesSearchResult from "./models/paginationModel";
import WorklogCollection from "@/models/worklogCollection";
import { v4 as uuidv4 } from "uuid";

export default class WorklogService {
    static async fetchIssuesByJQL(): Promise<WorklogCollection[]> {
        const authModel = await MessagingService.getAuthentication.invoke();
        if (authModel?.cloudId === undefined) {
            return Promise.reject("CloudId not specified on AuthModel");
        }
        if (authModel?.accountId === undefined) {
            return Promise.reject("AccountId is not specified");
        }

        const result = await FetchService.fetchModel<IssuesSearchResult>(
            `https://api.atlassian.com/ex/jira/${authModel.cloudId}/rest/api/3/search`,
            {
                queryParams: new URLSearchParams([
                    ["jql", 'worklogAuthor = currentUser() and worklogDate >= "-14d"'],
                    ["fields", "worklog,summary"]
                ])
            }
        );

        console.log("Issues fetched", result.data);
        const worklogCollections: WorklogCollection[] = [];
        if (result.data?.issues) {
            result.data.issues.forEach((issue) => {
                if (issue.fields?.worklog?.worklogs?.length) {
                    const collection = new WorklogCollection();
                    collection.collectionId = issue.id ?? uuidv4();
                    collection.collectionKey = issue.key ?? "UNKNOWN";
                    collection.collectionSummary = issue.fields.summary ?? "NO SUMMARY";

                    collection.worklogs = issue.fields.worklog.worklogs.filter(
                        (worklog) => worklog.author?.accountId === authModel.accountId
                    );
                    worklogCollections.push(collection);
                }
            });
        }

        console.groupCollapsed("Fetched worklogCollections");
        console.log(JSON.parse(JSON.stringify(worklogCollections)));
        console.groupEnd();

        return worklogCollections;
    }
}

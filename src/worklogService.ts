import { MessagingService } from "@/messagingService";
import FetchService from "./fetchService";
import { Worklog, type Issue } from "./models/jira/jiraModels";
import type IssuesSearchResult from "./models/paginationModel";

export default class WorklogService {
    static async fetchIssuesByJQL(): Promise<Issue[] | undefined> {
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

        if (result.data?.issues) {
            result.data.issues.filter((issue) => {
                if (issue.fields?.worklog?.worklogs) {
                    issue.fields.worklog.worklogs = issue.fields.worklog.worklogs.filter(
                        (worklog) => {
                            if (worklog.author?.accountId == authModel.accountId) {
                                return worklog;
                            }
                        }
                    );
                    if (issue.fields.worklog.worklogs.length > 0) {
                        return issue;
                    }
                }
            });
        }

        console.log(result);

        return Promise.resolve(result.data?.issues);
    }
}

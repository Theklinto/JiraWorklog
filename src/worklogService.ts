import FetchService from "./fetchService";
import { Worklog, type Issue } from "./models/jira/jiraModels";
import type IssuesSearchResult from "./models/paginationModel";
import { useAuthStore } from "./stores/authStore";

export default class WorklogService {
    static async fetchIssuesByJQL(): Promise<Issue[] | undefined> {
        const authStore = useAuthStore();
        const result = await FetchService.fetchModel<IssuesSearchResult>(
            `https://api.atlassian.com/ex/jira/${authStore.cloudId}/rest/api/3/search`,
            {
                queryParams: new URLSearchParams([
                    ["jql", 'worklogAuthor = currentUser() and worklogDate >= "-14d"'],
                    ["fields", "worklog,summary"]
                ])
            }
        );

        console.log("test", result);

        if (result.data?.issues) {
            result.data.issues.filter((issue) => {
                if (issue.fields?.worklog?.worklogs) {
                    issue.fields.worklog.worklogs = issue.fields.worklog.worklogs.filter(
                        (worklog) => {
                            if (worklog.author?.accountId == authStore.accountId) {
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

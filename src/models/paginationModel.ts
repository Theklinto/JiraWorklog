import type { Issue } from "./jira/jiraModels";

export default class IssuesSearchResult {
    expand?: string;
    issues?: Issue[];
    maxResults?: number;
    startAt?: number;
    total?: number;
    warningMessages?: string[];
}

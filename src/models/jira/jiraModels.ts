export class Author {
    accountId?: string;
    active?: boolean;
    displayName?: string;
    self?: string;
}

export class AvatarUrls {
    "16x16"?: string;
    "24x24"?: string;
    "32x32"?: string;
    "48x48"?: string;
}

export class ProjectCategory {
    description?: string;
    id?: string;
    name?: string;
    self?: string;
}

export class Project {
    avatarUrls?: AvatarUrls;
    id?: string;
    insight?: {
        lastIssueUpdateTime?: string;
        totalIssueCount?: number;
    };
    key?: string;
    name?: string;
    projectCategory?: ProjectCategory;
    self?: string;
    simplified?: boolean;
    style?: string;
}

export class CommentContent {
    type?: string;
    content?: { type?: string; text?: string }[];
}

export class CommentBody {
    type?: string;
    version?: number;
    content?: CommentContent[];
}

export class CommentVisibility {
    identifier?: string;
    type?: string;
    value?: string;
}

export class CommentAuthor {
    accountId?: string;
    active?: boolean;
    displayName?: string;
    self?: string;
}

export class CommentUpdateAuthor {
    accountId?: string;
    active?: boolean;
    displayName?: string;
    self?: string;
}

export class Comment {
    author?: CommentAuthor;
    body?: CommentBody;
    created?: string;
    id?: string;
    self?: string;
    updateAuthor?: CommentUpdateAuthor;
    updated?: string;
    visibility?: CommentVisibility;
}

export class OutwardIssueStatus {
    iconUrl?: string;
    name?: string;
}

export class OutwardIssueFields {
    status?: OutwardIssueStatus;
    id?: string;
    key?: string;
    self?: string;
}

export class OutwardIssue {
    fields?: OutwardIssueFields;
    id?: string;
    key?: string;
    self?: string;
}

export class IssueType {
    id?: string;
    inward?: string;
    name?: string;
    outward?: string;
}

export class SubTask {
    id?: string;
    outwardIssue?: OutwardIssue;
    type?: IssueType;
}

export class InwardIssueStatus {
    iconUrl?: string;
    name?: string;
}

export class InwardIssueFields {
    status?: InwardIssueStatus;
    id?: string;
    key?: string;
    self?: string;
}

export class InwardIssue {
    fields?: InwardIssueFields;
    id?: string;
    key?: string;
    self?: string;
}

export class IssueLinkType {
    id?: string;
    inward?: string;
    name?: string;
    outward?: string;
}

export class IssueLinks {
    id?: string;
    outwardIssue?: OutwardIssue;
    type?: IssueLinkType;
}

export class AttachmentAuthor {
    accountId?: string;
    accountType?: string;
    active?: boolean;
    avatarUrls?: AvatarUrls;
    displayName?: string;
    key?: string;
    name?: string;
    self?: string;
}

export class Attachment {
    author?: AttachmentAuthor;
    content?: string;
    created?: string;
    filename?: string;
    id?: number;
    mimeType?: string;
    self?: string;
    size?: number;
    thumbnail?: string;
}

export class WorklogAuthor {
    accountId?: string;
    active?: boolean;
    displayName?: string;
    self?: string;
}

export class WorklogComment {
    type?: string;
    version?: number;
    content?: { type?: string; text?: string }[];
}

export class WorklogVisibility {
    identifier?: string;
    type?: string;
    value?: string;
}

export class WorklogUpdateAuthor {
    accountId?: string;
    active?: boolean;
    displayName?: string;
    self?: string;
}

export class Worklog {
    author?: WorklogAuthor;
    comment?: WorklogComment;
    id?: string;
    issueId?: string;
    self?: string;
    started?: string;
    timeSpent?: string;
    timeSpentSeconds?: number;
    updateAuthor?: WorklogUpdateAuthor;
    updated?: string;
    visibility?: WorklogVisibility;
}

export class DescriptionContent {
    type?: string;
    content?: { type?: string; text?: string }[];
}

export class Description {
    type?: string;
    version?: number;
    content?: DescriptionContent[];
}

export class Watcher {
    accountId?: string;
    active?: boolean;
    displayName?: string;
    self?: string;
}

export class IssueFields {
    summary?: string;
    worklog?: WorklogPaginationModel;
}

export class WorklogPaginationModel {
    startAt?: number;
    maxResults?: number;
    total?: number;
    worklogs?: Worklog[];
}

export class Issue {
    expand?: string;
    fields?: IssueFields;
    id?: string;
    key?: string;
    self?: string;
}

export class IssuesResponse {
    expand?: string;
    issues?: Issue[];
    maxResults?: number;
    startAt?: number;
    total?: number;
    warningMessages?: string[];
}

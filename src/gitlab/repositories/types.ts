export enum UserState {
	ACTIVE = 'active',
	BLOCKED = 'blocked',
}

export enum AwardName {
	THUMBSUP = 'thumbsup',
	THUMBSDOWN = 'thumbsdown',
}

export type Project = {
	id: number;
	name: string;
};

export type User = {
	id: number;
	username: string;
	state: UserState;
};

type Note = {
	body: string;
	noteable_iid: number;
	project_id: number;
};

export type CommentEvent = {
	project_id: number;
	target_title: string;
	note: Note;
};

export type EventQuery = {
	projectId: number;
	targetType: string;
	action: string;
	after?: string;
	before?: string;
};

export type MergeRequest = {
	title: string;
	upvotes: number;
	downvotes: number;
};

export type MergeRequestAward = {
	name: AwardName;
	user: User;
};

export type MergeRequestReviewAwards = {
	[AwardName.THUMBSUP]: number;
	[AwardName.THUMBSDOWN]: number;
};

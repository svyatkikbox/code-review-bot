export enum UserState {
	ACTIVE = 'active',
	BLOCKED = 'blocked',
}

export enum AwardName {
	THUMBSUP = 'thumbsup',
	THUMBSDOWN = 'thumbsdown',
}

export enum NoteableType {
	MR = 'MergeRequest',
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
	noteable_type: NoteableType;
};

export type CommentEvent = {
	project_id: number;
	target_title: string;
	note: Note;
};

export type ReviewCall = {
	link: string;
	title: string;
	awards: MergeRequestReviewAwards;
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

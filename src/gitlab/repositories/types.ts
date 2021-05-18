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

export enum MergeRequestLabel {
	NEED_REVIEW = 'need review',
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
	noteableIid: number;
	projectId: number;
	noteableType: NoteableType;
};

export type CommentEvent = {
	projectId: number;
	targetTitle: string;
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
	labels: MergeRequestLabel[];
};

export type MergeRequestAward = {
	name: AwardName;
	user: User;
};

export type MergeRequestReviewAwards = {
	[AwardName.THUMBSUP]: number;
	[AwardName.THUMBSDOWN]: number;
};

export type MergeRequestDiscussion = {
	individualNote: boolean;
	notes: {
		type: string | null;
		body: string;
		createdAt: string;
		system: boolean;
		resolvable: boolean;
		resolved: boolean;
	};
};

export type MergeRequestNote = {
	type: string | null;
	body: string;
	createdAt: string;
	system: boolean;
	resolvable: boolean;
	resolved: boolean;
};

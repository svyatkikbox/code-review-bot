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

export type UserRaw = {
	id: number;
	username: string;
	state: UserState;
};

export type User = Omit<UserRaw, 'username'> & { userName: string };

export type MergeRequestRaw = {
	iid: number;
	title: string;
	upvotes: number;
	downvotes: number;
	labels: MergeRequestLabel[];
	web_url: string;
};

export type MergeRequest = Omit<MergeRequestRaw, 'iid' | 'web_url'> & {
	id: number;
	webUrl: string;
};

export type MergeRequestAwardRaw = {
	name: AwardName;
	user: UserRaw;
	created_at: string;
};

export type MergeRequestAward = Omit<
	MergeRequestAwardRaw,
	'created_at' | 'user'
> & {
	userName: string;
	createdAt: string;
};

export type MergeRequestReviewAwards = {
	likes: MergeRequestAward[];
	dislikes: MergeRequestAward[];
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

export type MergeRequestNoteRaw = {
	type: string | null;
	body: string;
	created_at: string;
	system: boolean;
	resolvable: boolean;
	resolved: boolean;
};

export type MergeRequestNote = Omit<MergeRequestNoteRaw, 'created_at'> & {
	type: string | null;
	body: string;
	createdAt: string;
	system: boolean;
	resolvable: boolean;
	resolved: boolean;
};

export type PaginationParams = {
	perPage?: number;
	page?: number;
};

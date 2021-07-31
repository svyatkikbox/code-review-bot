type Project = {
	id: number;
	name: string;
};

export type SubscriptionRaw = {
	id: number;
	user_id: number;
	project_ids: number;
};

export type Subscription = {
	userId: number;
	projects: Project[];
};

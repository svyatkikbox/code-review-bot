type Project = {
	id: number;
	name: string;
};

export type Subscription = {
	projects: Project[];
};

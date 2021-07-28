import { User, Project, CommentEvent, MergeRequest } from '../types';

export interface IProjectRepository {
	getProjectByName(name: string): Promise<Project | null>;

	getProjectUserByUsername(
		projectId: number,
		username: string
	): Promise<User | null>;

	getProjectReviewCalls(projectId: number): Promise<CommentEvent[]>;

	getProjectUserMergeRequests(
		projectId: number,
		userName: string
	): Promise<MergeRequest[]>;
}

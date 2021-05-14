import {
	User,
	MergeRequest,
	Project,
	MergeRequestReviewAwards,
	CommentEvent,
} from '../types';

export interface IProjectRepository {
	getProjectByName(name: string): Promise<Project | null>;

	getProjectUserByUsername(
		projectId: string,
		username: string
	): Promise<User | null>;

	getProjectReviewCalls(projectId: number): Promise<CommentEvent[]>;

	getMergeRequest(
		projectId: string,
		mergeRequestId: string
	): Promise<MergeRequest>;

	getMergeRequestReviewAwards(
		projectId: string,
		mergeRequestId: string
	): Promise<MergeRequestReviewAwards>;
}

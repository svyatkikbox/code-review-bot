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
		projectId: number,
		username: string
	): Promise<User | null>;

	getProjectReviewCalls(projectId: number): Promise<CommentEvent[]>;

	getMergeRequest(
		projectId: number,
		mergeRequestId: number
	): Promise<MergeRequest>;

	getMergeRequestReviewAwards(
		projectId: number,
		mergeRequestId: number
	): Promise<MergeRequestReviewAwards>;
}

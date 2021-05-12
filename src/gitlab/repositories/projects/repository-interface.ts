import {
	User,
	EventQuery,
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

	getProjectReviewCalls(query: EventQuery): Promise<CommentEvent[]>;

	getMergeRequest(
		projectId: string,
		mergeRequestId: string
	): Promise<MergeRequest>;

	getMergeRequestReviewAwards(
		projectId: string,
		mergeRequestId: string
	): Promise<MergeRequestReviewAwards>;
}

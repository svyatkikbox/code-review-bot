import { MergeRequest } from '../types';

export interface IMergeRequestRepository {
	getProjectUserMergeRequests(
		projectId: number,
		userName: string
	): Promise<MergeRequest[]>;

	getProjectMergeRequests(projectId: number): Promise<MergeRequest[]>;

	getProjectReviewsData(projectId: number): Promise<any>;
}

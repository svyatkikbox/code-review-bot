import { MergeRequest } from '../types';

export interface IMergeRequestRepository {
	getProjectUserMergeRequests(
		projectId: number,
		userName: string
	): Promise<MergeRequest[]>;
}

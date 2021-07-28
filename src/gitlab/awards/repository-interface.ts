import { MergeRequestReviewAwards } from '../types';

export interface IAwardRepository {
	getMergeRequestAwards(
		projectId: number,
		mergeRequestId: number
	): Promise<MergeRequestReviewAwards>;
}

import { MergeRequestNote } from '../types';

export interface INoteRepository {
	getMergeRequestNotes(
		projectId: number,
		mergeRequestId: number
	): Promise<MergeRequestNote[]>;
}

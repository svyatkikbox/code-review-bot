import { Mapper } from 'src/mappers/mapper-interface';
import { GitlabAPI } from '../gitlab-api';
import { MergeRequestNote, MergeRequestNoteRaw } from '../types';
import { INoteRepository } from './repository-interface';

export class NoteRepository implements INoteRepository {
	constructor(
		private readonly gitlabAPI: GitlabAPI,
		private readonly mapper: Mapper<MergeRequestNote, MergeRequestNoteRaw>
	) {}

	async getMergeRequestNotes(
		projectId: number,
		mergeRequestId: number
	): Promise<MergeRequestNote[]> {
		const url = `/projects/${projectId}/merge_requests/${mergeRequestId}/notes`;
		const mergeRequestNoteRaw =
			await this.gitlabAPI.paginatedSearch<MergeRequestNoteRaw>(url);

		const notes: MergeRequestNote[] = mergeRequestNoteRaw
			.map(note => this.mapper.toDomain(note))
			.filter(note => !note.system);

		return notes;
	}
}

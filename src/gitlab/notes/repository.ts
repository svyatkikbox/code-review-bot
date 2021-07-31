import { IMapper } from 'src/mappers/mapper-interface';
import { HttpService } from '../http-service';
import { MergeRequestNote, MergeRequestNoteRaw } from '../types';
import { INoteRepository } from './repository-interface';

export class NoteRepository implements INoteRepository {
	constructor(
		private readonly gitlabAPI: HttpService,
		private readonly mapper: IMapper<MergeRequestNote, MergeRequestNoteRaw>
	) {}

	async getMergeRequestNotes(
		projectId: number,
		mergeRequestId: number
	): Promise<MergeRequestNote[]> {
		const url = `/projects/${projectId}/merge_requests/${mergeRequestId}/notes`;
		const mergeRequestNoteRaw =
			await this.gitlabAPI.fetchPaginated<MergeRequestNoteRaw>(url);

		const notes: MergeRequestNote[] = mergeRequestNoteRaw
			.map(note => this.mapper.toDomain(note))
			.filter(note => !note.system);

		return notes;
	}
}

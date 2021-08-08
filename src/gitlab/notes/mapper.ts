import { MergeRequestNote, MergeRequestNoteRaw } from '../types';
import { IMapper } from '../../mapper-interface';

export class NoteMap implements IMapper<MergeRequestNote, MergeRequestNoteRaw> {
	toDomain(raw: MergeRequestNoteRaw): MergeRequestNote {
		return {
			type: raw.type,
			body: raw.body,
			system: raw.system,
			resolvable: raw.resolvable,
			resolved: raw.resolved,
			createdAt: raw.created_at,
		};
	}

	toModel(entity: MergeRequestNote): MergeRequestNoteRaw {
		throw new Error('Method not implemented.');
	}
}

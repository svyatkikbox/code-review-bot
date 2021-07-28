import { MergeRequestAward, MergeRequestAwardRaw } from '../gitlab/types';
import { Mapper } from './mapper-interface';

export class AwardMap
	implements Mapper<MergeRequestAward, MergeRequestAwardRaw>
{
	toDomain(raw: MergeRequestAwardRaw): MergeRequestAward {
		return {
			name: raw.name,
			userName: raw.user.userName,
			createdAt: raw.created_at,
		};
	}
	toModel(entity: MergeRequestAward): MergeRequestAwardRaw {
		throw new Error('Method not implemented.');
	}
}

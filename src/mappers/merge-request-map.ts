import { MergeRequest, MergeRequestRaw } from '../gitlab/types';
import { Mapper } from './mapper-interface';

export class MergeRequestMap implements Mapper<MergeRequest, MergeRequestRaw> {
	toModel(entity: MergeRequest): MergeRequestRaw {
		return {
			iid: entity.id,
			title: entity.title,
			upvotes: entity.upvotes,
			downvotes: entity.downvotes,
			labels: entity.labels,
			web_url: entity.webUrl,
		};
	}

	toDomain(raw: MergeRequestRaw): MergeRequest {
		return {
			id: raw.iid,
			title: raw.title,
			upvotes: raw.upvotes,
			downvotes: raw.downvotes,
			labels: raw.labels,
			webUrl: raw.web_url,
		};
	}
}

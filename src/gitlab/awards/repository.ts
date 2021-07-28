import { AxiosInstance } from 'axios';

import { Mapper } from '../../mappers/mapper-interface';
import {
	AwardName,
	MergeRequestAward,
	MergeRequestAwardRaw,
	MergeRequestReviewAwards,
} from '../types';
import { IAwardRepository } from './repository-interface';

export class AwardRepository implements IAwardRepository {
	constructor(
		private readonly gitlabAPI: AxiosInstance,
		private readonly mapper: Mapper<MergeRequestAward, MergeRequestAwardRaw>
	) {}

	async getMergeRequestAwards(
		projectId: number,
		mergeRequestId: number
	): Promise<MergeRequestReviewAwards> {
		const response = await this.gitlabAPI.get(
			`/projects/${projectId}/merge_requests/${mergeRequestId}/award_emoji/`
		);
		const mergeRequestAwards: MergeRequestAwardRaw[] = response.data;
		const awards: MergeRequestAward[] = mergeRequestAwards.map(award =>
			this.mapper.toDomain(award)
		);
		const likes = awards.filter(award => award.name === AwardName.THUMBSUP);
		const dislikes = awards.filter(
			award => award.name === AwardName.THUMBSDOWN
		);

		return {
			likes,
			dislikes,
		};
	}
}

import { Mapper } from '../../mappers/mapper-interface';
import { IHttpService } from '../http-service';
import {
	AwardName,
	MergeRequestAward,
	MergeRequestAwardRaw,
	MergeRequestReviewAwards,
} from '../types';
import { IAwardRepository } from './repository-interface';

export class AwardRepository implements IAwardRepository {
	constructor(
		private readonly gitlabAPI: IHttpService,
		private readonly mapper: Mapper<MergeRequestAward, MergeRequestAwardRaw>
	) {}

	async getMergeRequestAwards(
		projectId: number,
		mergeRequestId: number
	): Promise<MergeRequestReviewAwards> {
		const mergeRequestAwards = await this.gitlabAPI.get<MergeRequestAwardRaw[]>(
			`/projects/${projectId}/merge_requests/${mergeRequestId}/award_emoji/`
		);
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

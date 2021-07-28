import { Mapper } from '../../mappers/mapper-interface';
import { IHttpService } from '../http-service';
import { MergeRequest, MergeRequestRaw } from '../types';
import { IMergeRequestRepository } from './repository-interface';

export class MergeRequestRepository implements IMergeRequestRepository {
	constructor(
		private readonly gitlabAPI: IHttpService,
		private readonly mapper: Mapper<MergeRequest, MergeRequestRaw>
	) {}

	async getProjectUserMergeRequests(
		projectId: number,
		userName: string
	): Promise<MergeRequest[]> {
		const url = `/projects/${projectId}/merge_requests?state=opened&author_username=${userName}`;

		const mergeRequestsRawData =
			await this.gitlabAPI.fetchPaginated<MergeRequestRaw>(url);

		const mergeRequestsData: MergeRequest[] = mergeRequestsRawData.map(mrData =>
			this.mapper.toDomain(mrData)
		);

		return mergeRequestsData;
	}

	async getProjectMergeRequests(projectId: number): Promise<MergeRequest[]> {
		const url = `projects/${projectId}/merge_requests?state=opened`;
		const mergeRequestsRawData =
			await this.gitlabAPI.fetchPaginated<MergeRequestRaw>(url);

		const mergeRequestsData: MergeRequest[] = mergeRequestsRawData.map(mrData =>
			this.mapper.toDomain(mrData)
		);

		return mergeRequestsData;
	}
}

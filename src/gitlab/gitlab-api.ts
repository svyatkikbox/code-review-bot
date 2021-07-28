import { AxiosInstance } from 'axios';
import {
	AwardName,
	MergeRequest,
	MergeRequestAward,
	MergeRequestAwardRaw,
	MergeRequestDiscussion,
	MergeRequestNote,
	MergeRequestNoteRaw,
	MergeRequestRaw,
	MergeRequestReviewAwards,
	PaginationParams,
} from './types';

export class GitlabAPI {
	constructor(private readonly http: AxiosInstance) {}

	async paginatedSearch<T>(
		url: string,
		params?: PaginationParams
	): Promise<T[]> {
		const perPage = params?.perPage || 100;
		let page = params?.page || 1;

		const data = [];
		let end = false;

		while (end !== true) {
			const response = await this.http.get(url, {
				params: {
					per_page: perPage,
					page,
				},
			});

			data.push(...response.data);
			page++;

			if (!response.data.length) {
				end = true;
			}
		}

		return data as T[]; // TODO add runtime validation
	}

	async getProjectMergeRequestsData(
		projectId: number
	): Promise<MergeRequest[]> {
		const url = `projects/${projectId}/merge_requests?state=opened`;
		const mergeRequestsRawData = await this.paginatedSearch<MergeRequestRaw>(
			url
		);

		const mergeRequestsData: MergeRequest[] = mergeRequestsRawData.map(
			mrData => ({
				id: mrData.iid,
				title: mrData.title,
				upvotes: mrData.upvotes,
				downvotes: mrData.downvotes,
				labels: mrData.labels,
				webUrl: mrData.web_url,
			})
		);

		return mergeRequestsData;
	}

	async getMergeRequestAwards(
		projectId: number,
		mergeRequestId: number
	): Promise<MergeRequestReviewAwards> {
		const response = await this.http.get(
			`/projects/${projectId}/merge_requests/${mergeRequestId}/award_emoji/`
		);
		const mergeRequestAwards: MergeRequestAwardRaw[] = response.data;
		const awards: MergeRequestAward[] = mergeRequestAwards.map(award => ({
			name: award.name,
			userName: award.user.userName,
			createdAt: award.created_at,
		}));
		const likes = awards.filter(award => award.name === AwardName.THUMBSUP);
		const dislikes = awards.filter(
			award => award.name === AwardName.THUMBSDOWN
		);

		return {
			likes,
			dislikes,
		};
	}

	async getMergeRequestDiscussions(
		projectId: number,
		mergeRequestId: number
	): Promise<MergeRequestDiscussion[]> {
		const response = await this.http.get(
			`/projects/${projectId}/merge_requests/${mergeRequestId}/discussions/`
		);

		return response.data;
	}

	async getMergeRequestNotes(
		projectId: number,
		mergeRequestId: number
	): Promise<MergeRequestNote[]> {
		const url = `/projects/${projectId}/merge_requests/${mergeRequestId}/notes`;
		const mergeRequestNoteRaw = await this.paginatedSearch<MergeRequestNoteRaw>(
			url
		);

		const notes: MergeRequestNote[] = mergeRequestNoteRaw
			.map(note => ({
				type: note.type,
				body: note.body,
				system: note.system,
				resolvable: note.resolvable,
				resolved: note.resolved,
				createdAt: note.created_at,
			}))
			.filter(note => !note.system);

		return notes;
	}
}

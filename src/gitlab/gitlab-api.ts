import { AxiosInstance } from 'axios';
import {
	MergeRequest,
	MergeRequestAward,
	MergeRequestDiscussion,
	MergeRequestNote,
	Project,
	User,
} from './repositories/types';

export class GitlabAPI {
	constructor(private readonly http: AxiosInstance) {}

	async getUserByUsername(username: string): Promise<User[]> {
		const response = await this.http.get(`users?username=${username}`);

		return response.data;
	}

	async getProjectByName(name: string): Promise<Project[]> {
		const response = await this.http.get(`projects?search=${name}`);

		return response.data;
	}

	async getProjectUserByUsername(
		projectId: number,
		username: string
	): Promise<User[]> {
		const response = await this.http.get(
			`projects/${projectId}/users?search=${username}`
		);

		return response.data;
	}

	/**
	 * collect data from all open project's MRs with "need review" label
	 * @param projectId number
	 */
	async getProjectMergeRequestsData(
		projectId: number
	): Promise<MergeRequest[]> {
		let page = 1;
		let end = false;

		const mergeRequestsRawData = [];

		// TODO сделать асинхронным
		while (end !== true) {
			const url = `projects/${projectId}/merge_requests?state=opened&labels=need%20review&per_page=100&page=${page}`;

			const response = await this.http.get(url);

			mergeRequestsRawData.push(...response.data);
			page++;

			if (!response.data.length) {
				end = true;
			}
		}

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
	): Promise<MergeRequestAward[]> {
		const response = await this.http.get(
			`/projects/${projectId}/merge_requests/${mergeRequestId}/award_emoji/`
		);

		return response.data;
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
		const response = await this.http.get(
			`/projects/${projectId}/merge_requests/${mergeRequestId}/notes/`
		);

		return response.data;
	}
}

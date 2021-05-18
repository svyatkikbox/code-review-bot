import { AxiosInstance } from 'axios';
import { addDays, format, subDays } from 'date-fns';
import {
	CommentEvent,
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

		const mergeRequestsData: MergeRequest[] = [];

		// TODO сделать асинхронным
		while (end !== true) {
			const url = `projects/${projectId}/merge_requests?state=opened&labels=need%20review&per_page=100&page=${page}`;

			const response = await this.http.get(url);

			mergeRequestsData.push(...response.data);
			page++;

			if (!response.data.length) {
				end = true;
			}
		}

		return mergeRequestsData;
	}

	async getMergeRequestData(
		projectId: number,
		mergeRequestId: number
	): Promise<MergeRequest> {
		const response = await this.http.get(
			`projects/${projectId}/merge_requests/${mergeRequestId}/`
		);

		return response.data;
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

	async getProjectCommentEvents(projectId: number): Promise<CommentEvent[]> {
		const today = new Date();
		const tomorrow = format(addDays(today, 1), 'y-LL-dd');
		const nDaysAgo = format(subDays(today, 14), 'y-LL-dd');

		let page = 1;
		let end = false;
		const events: CommentEvent[] = [];

		// TODO сделать асинхронным
		while (end !== true) {
			const url = `projects/${projectId}/events?target_type=note&action=commented&after=${nDaysAgo}&before=${tomorrow}&per_page=100&page=${page}`;

			const response = await this.http.get(url);

			events.push(...response.data);
			page++;

			if (!response.data.length) {
				end = true;
			}
		}

		return events;
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

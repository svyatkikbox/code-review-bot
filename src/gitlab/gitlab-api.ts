import { AxiosInstance } from 'axios';
import { addDays, format, subDays } from 'date-fns';

import {
	CommentEvent,
	MergeRequestAward,
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
		projectId: string,
		username: string
	): Promise<User[]> {
		const response = await this.http.get(
			`projects/${projectId}/users?search=${username}`
		);

		return response.data;
	}

	async getMergeRequestAwards(
		projectId: string,
		mergeRequestId: string
	): Promise<MergeRequestAward[]> {
		const response = await this.http.get(
			`/projects/${projectId}/merge_requests/${mergeRequestId}/award_emoji/`
		);

		return response.data;
	}

	async getCommentEvents(projectId: number): Promise<CommentEvent[]> {
		const today = new Date();
		const tomorrow = format(addDays(today, 1), 'y-LL-dd');
		const nDaysAgo = format(subDays(today, 14), 'y-LL-dd');

		let page = 1;
		let end = false;
		const events: CommentEvent[] = [];

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
}

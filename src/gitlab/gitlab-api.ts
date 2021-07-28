import { AxiosInstance } from 'axios';
import { PaginationParams } from './types';

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
}

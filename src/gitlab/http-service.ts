import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

import { PaginationParams } from './types';

interface IRequestConfig extends AxiosRequestConfig {
	baseURL?: string;
	headers?: Record<string, string>;
	params?: any;
	data?: any;
}
export interface IHttpService {
	get<T>(url: string, requestConfig?: IRequestConfig): Promise<T>;

	fetchPaginated<T>(url: string, params?: PaginationParams): Promise<T[]>;
}
export class HttpService implements IHttpService {
	http: AxiosInstance;

	constructor(config: IRequestConfig) {
		this.http = axios.create(config);
	}

	async get<T>(url: string, requestConfig?: IRequestConfig): Promise<T> {
		const { data } = await this.http.get(url, requestConfig);

		return data;
	}

	async fetchPaginated<T>(
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

import axios, { AxiosInstance } from 'axios';
import config from '../config';

export const httpService: AxiosInstance = axios.create({
	baseURL: config.GITLAB_URL,
	headers: {
		'PRIVATE-TOKEN': config.GITLAB_TOKEN,
	},
});

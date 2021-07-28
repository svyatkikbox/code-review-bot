import { AxiosInstance } from 'axios';

import { Project, User } from '../types';
import { IProjectRepository } from './repository-interface';

export class ProjectRepository implements IProjectRepository {
	constructor(private readonly gitlabHttp: AxiosInstance) {}

	async getByName(name: string): Promise<Project | null> {
		const { data: projectsData } = await this.gitlabHttp.get(
			`projects?search=${name}`
		);

		const project = (projectsData as Project[]).find(p => p.name === name);

		if (!project) {
			return null;
		}

		return project;
	}

	async getProjectUserByUsername(
		projectId: number,
		userName: string
	): Promise<User | null> {
		const { data: usersData } = await this.gitlabHttp.get(
			`projects/${projectId}/users?search=${userName}`
		);

		const user = (usersData as User[]).find(u => u.userName === userName);

		if (!user) {
			return null;
		}

		return user;
	}
}

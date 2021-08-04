import { User, Project } from '../types';

export interface IProjectRepository {
	getByName(name: string): Promise<Project | null>;

	getProjectUserByUsername(
		projectId: number,
		userName: string
	): Promise<User | null>;
}

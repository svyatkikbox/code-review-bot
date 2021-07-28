import { User, Project, CommentEvent, MergeRequest } from '../types';

export interface IProjectRepository {
	getByName(name: string): Promise<Project | null>;

	getProjectUserByUsername(
		projectId: number,
		userName: string
	): Promise<User | null>;
}

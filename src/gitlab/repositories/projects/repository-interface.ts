import { User, Project, CommentEvent } from '../types';

export interface IProjectRepository {
	getProjectByName(name: string): Promise<Project | null>;

	getProjectUserByUsername(
		projectId: number,
		username: string
	): Promise<User | null>;

	getProjectReviewCalls(projectId: number): Promise<CommentEvent[]>;
}

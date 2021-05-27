import { GitlabAPI } from '../../gitlab-api';
import { Mention, MergeRequestNote, Project, User } from '../types';
import { IProjectRepository } from './repository-interface';

export class ProjectRepository implements IProjectRepository {
	constructor(private readonly gitlabAPI: GitlabAPI) {}

	async getProjectByName(name: string): Promise<Project | null> {
		const projectsData = await this.gitlabAPI.getProjectByName(name);
		const project = projectsData.find(p => p.name === name);

		if (!project) {
			return null;
		}

		return project;
	}

	async getProjectUserByUsername(
		projectId: number,
		username: string
	): Promise<User | null> {
		const usersData = await this.gitlabAPI.getProjectUserByUsername(
			projectId,
			username
		);
		const user = usersData.find(u => u.username === username);

		if (!user) {
			return null;
		}

		return user;
	}

	private extractMentionsFromNotes(mrNotes: MergeRequestNote[]): Mention[] {
		const userMentionRegex = new RegExp(/\@\w*/g);
		const mentions = mrNotes.map(note => {
			return {
				userName: note.body.match(userMentionRegex),
				createdAt: note.createdAt,
			};
		});

		return [];
	}

	async getProjectReviewCalls(projectId: number): Promise<[]> {
		const mergeRequestsData = await this.gitlabAPI.getProjectMergeRequestsData(
			projectId
		);

		for (const mrData of mergeRequestsData) {
			console.log('==== mr data' + mrData.id + ' ====');

			const [mrNotes, mrAwards] = await Promise.all([
				this.gitlabAPI.getMergeRequestNotes(projectId, mrData.id),
				this.gitlabAPI.getMergeRequestAwards(projectId, mrData.id),
			]);
		}

		return [];
	}
}

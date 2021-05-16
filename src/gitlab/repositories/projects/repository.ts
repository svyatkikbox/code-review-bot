import { GitlabAPI } from '../../gitlab-api';
import {
	AwardName,
	CommentEvent,
	MergeRequest,
	MergeRequestReviewAwards,
	NoteableType,
	Project,
	User,
} from '../types';
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

	async getProjectReviewCalls(projectId: number): Promise<[]> {
		const mergeRequestsData = await this.gitlabAPI.getProjectMergeRequestsData(
			projectId
		);

		return [];
	}

	async getMergeRequest(
		projectId: number,
		mergeRequestId: number
	): Promise<MergeRequest> {
		const mergeRequestData = await this.gitlabAPI.getMergeRequestData(
			projectId,
			mergeRequestId
		);

		return {
			title: mergeRequestData.title,
			upvotes: mergeRequestData.upvotes,
			downvotes: mergeRequestData.downvotes,
			labels: mergeRequestData.labels,
		};
	}

	async getMergeRequestReviewAwards(
		projectId: number,
		mergeRequestId: number
	): Promise<MergeRequestReviewAwards> {
		const mergeRequestAwards = await this.gitlabAPI.getMergeRequestAwards(
			projectId,
			mergeRequestId
		);
		const reviewLikes = mergeRequestAwards.filter(
			award => award.name === AwardName.THUMBSUP
		).length;
		const reviewDisLikes = mergeRequestAwards.filter(
			award => award.name === AwardName.THUMBSDOWN
		).length;

		const awards = {
			[AwardName.THUMBSUP]: reviewLikes,
			[AwardName.THUMBSDOWN]: reviewDisLikes,
		};

		return awards;
	}
}

import { GitlabAPI } from '../../gitlab-api';
import {
	AwardName,
	CommentEvent,
	EventQuery,
	MergeRequest,
	MergeRequestReviewAwards,
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
		projectId: string,
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

	async getProjectReviewCalls(query: EventQuery): Promise<CommentEvent[]> {
		const eventsData = await this.gitlabAPI.getCommentEvents(query);

		return eventsData;
	}

	async getMergeRequest(
		projectId: string,
		mergeRequestId: string
	): Promise<MergeRequest> {
		throw new Error('Method not implemented.');
	}

	async getMergeRequestReviewAwards(
		projectId: string,
		mergeRequestId: string
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

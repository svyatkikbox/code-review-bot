import compareAsc from 'date-fns/compareAsc';
import { GitlabAPI } from '../../gitlab-api';
import {
	Mention,
	MergeRequest,
	MergeRequestNote,
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

	private extractMentionsFromNotes(
		userName: string,
		mrNotes: MergeRequestNote[]
	): Mention[] {
		const userMentionRegex = new RegExp(/\@\w*/g);
		const mentions = mrNotes.map(note => ({
			userNames: note.body.match(userMentionRegex),
			body: note.body,
			createdAt: note.createdAt,
			resolved: note.resolved,
			resolvable: note.resolvable,
		}));
		const userMentions = mentions.filter(mention =>
			mention.userNames?.includes(`@${userName}`)
		);

		return userMentions;
	}

	async getProjectReviewCalls(projectId: number): Promise<[]> {
		const mergeRequestsData = await this.gitlabAPI.getProjectMergeRequestsData(
			projectId
		);

		for (const mrData of mergeRequestsData) {
			const [mrNotes, mrAwards] = await Promise.all([
				this.gitlabAPI.getMergeRequestNotes(projectId, mrData.id),
				this.gitlabAPI.getMergeRequestAwards(projectId, mrData.id),
			]);

			/*
			 * 1 получили инфу про мр полную
			 * 2 получили по его id дискуссии и лукасы/дизлукасы
			 * 3 нужно понять, есть ли юзер в дискуссах
			 * 4 позвали ли пользователя в этом МР?
			 * - есть ли дискуссии resolvable && !resolved с пользователем?
			 * - есть ли дискуссии !resolvable с пользователем после его лайка/дизлайка (поздней самой оценки)?
			 */

			const userName = 'svyat'; // TODO получаем из подписки
			const userMentions = this.extractMentionsFromNotes(userName, mrNotes);
			const notResolvedNotes = userMentions.filter(
				mention => mention.resolvable && !mention.resolved
			);
			const notResolvableNotes = userMentions.filter(
				mention => !mention.resolvable
			);
			const userLike = mrAwards.likes.find(
				award => award.userName === userName
			);
			const userDislike = mrAwards.dislikes.find(
				award => award.userName === userName
			);
			const lastUserEstimate = [userLike, userDislike]
				.map(estimate => estimate?.createdAt)
				.filter(estimate => !!estimate)
				.map(createdAt => new Date(createdAt as string))
				.sort(compareAsc).length;
		}

		return [];
	}

	async getProjectUserMergeRequests(
		projectId: number,
		userName: string
	): Promise<MergeRequest[]> {
		const userMrs = this.gitlabAPI.getProjectUserMergeRequests(
			projectId,
			userName
		);

		return userMrs;
	}
}

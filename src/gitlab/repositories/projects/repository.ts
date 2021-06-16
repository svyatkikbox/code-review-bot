import compareDesc from 'date-fns/compareDesc';
import isAfter from 'date-fns/isAfter';

import { GitlabAPI } from '../../gitlab-api';
import {
	Mention,
	MergeRequest,
	MergeRequestNote,
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

	private extractUnresolvedMentions(userMentions: Mention[]): Mention[] {
		const unResolvedMentions = userMentions.filter(
			mention => mention.resolvable && !mention.resolved
		);
		return unResolvedMentions;
	}

	private extractUnresolvableMentions(userMentions: Mention[]): Mention[] {
		const unResolvableMentions = userMentions.filter(
			mention => !mention.resolvable
		);
		return unResolvableMentions;
	}

	getLastUserEstimateDate(
		userName: string,
		mergeRequestAwards: MergeRequestReviewAwards
	): Date | null {
		const userLike = mergeRequestAwards.likes.find(
			award => award.userName === userName
		);
		const userDislike = mergeRequestAwards.dislikes.find(
			award => award.userName === userName
		);

		if (!userLike && !userDislike) return null;

		const lastUserEstimateDate = [userLike, userDislike]
			.map(estimate => estimate?.createdAt)
			.filter(estimate => !!estimate)
			.map(createdAt => new Date(createdAt as string))
			.sort(compareDesc)[0];

		return lastUserEstimateDate;
	}

	/*
	 * звать если
	 * - есть дискуссии !resolvable
	 * - - если лайк не стоит
	 * - - если отметка стоит после того, как поставил лайк
	 * - есть дискуссии resolvable && !resolved с пользователем?
	 */
	shouldUserBeCalledInMergeRequest(
		userName: string,
		userMentions: Mention[],
		mergeRequestAwards: MergeRequestReviewAwards
	): boolean {
		let shoulBeCalled = false;

		const unResolvedMentions = this.extractUnresolvedMentions(userMentions);
		const unResolvableMentions = this.extractUnresolvableMentions(userMentions);
		const lastUserEstimateDate = this.getLastUserEstimateDate(
			userName,
			mergeRequestAwards
		);

		const isEstimated = !!lastUserEstimateDate;
		const isThereAnyUnresolvedMention = !!unResolvedMentions.length;
		const isThereAnyUnresolvableMention = !!unResolvableMentions.length;
		const lastUnresolvableMentionDate = isThereAnyUnresolvableMention
			? new Date(unResolvableMentions[0].createdAt)
			: null;
		const isMentionedAfterEstimated =
			!!lastUnresolvableMentionDate &&
			isAfter(
				new Date(lastUnresolvableMentionDate),
				lastUserEstimateDate || new Date(0)
			);

		if (
			(isThereAnyUnresolvableMention && !isEstimated) ||
			(isThereAnyUnresolvableMention && isMentionedAfterEstimated) ||
			isThereAnyUnresolvedMention
		) {
			shoulBeCalled = true;
		}

		return shoulBeCalled;
	}

	async getProjectReviewCalls(projectId: number): Promise<any[]> {
		const mergeRequestsData = await this.gitlabAPI.getProjectMergeRequestsData(
			projectId
		);

		const mrs: MergeRequest[] = [];
		for (const mrData of mergeRequestsData) {
			const [mrNotes, mrAwards] = await Promise.all([
				this.gitlabAPI.getMergeRequestNotes(projectId, mrData.id),
				this.gitlabAPI.getMergeRequestAwards(projectId, mrData.id),
			]);

			const userName = 'svyat'; // TODO получаем из подписки
			const userMentions = this.extractMentionsFromNotes(userName, mrNotes);

			if (
				this.shouldUserBeCalledInMergeRequest(userName, userMentions, mrAwards)
			) {
				mrs.push(mrData);
			}
		}

		return mrs;
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

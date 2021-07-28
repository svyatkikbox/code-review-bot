import { compareDesc, isAfter } from 'date-fns';

import { IAwardRepository } from './awards/repository-interface';
import { IMergeRequestRepository } from './merge-requests/repository-interface';
import { INoteRepository } from './notes/repository-interface';
import {
	Mention,
	MergeRequest,
	MergeRequestNote,
	MergeRequestReviewAwards,
} from './types';

export class GitlabService {
	constructor(
		private readonly mergeRequestRepo: IMergeRequestRepository,
		private readonly noteRepo: INoteRepository,
		private readonly awardRepo: IAwardRepository
	) {}

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
	 * treat as #needReview if
	 * - there are discussions !resolvable
	 * - - no estimates (marked with thumbup)
	 * - - user was mentioned after he had estimated MR
	 * - there are discussions resolvable && !resolved with user mentioned
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
		const mergeRequestsData =
			await this.mergeRequestRepo.getProjectMergeRequests(projectId);

		const mrs: MergeRequest[] = [];
		for (const mrData of mergeRequestsData) {
			const [mrNotes, mrAwards] = await Promise.all([
				this.noteRepo.getMergeRequestNotes(projectId, mrData.id),
				this.awardRepo.getMergeRequestAwards(projectId, mrData.id),
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
}

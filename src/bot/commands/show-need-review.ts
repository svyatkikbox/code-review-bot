import { NarrowedContext, Scenes } from 'telegraf';
import { BotCommand, Update } from 'telegraf/typings/core/types/typegram';
import { dictionary } from '../../dictionary';
import { GitlabService } from '../../gitlab/gitlab-service';
import { ISubscriptionRepository } from '../subscription/repository-interface';
import { IBotCommandHandler } from './command-handler-interface';

class ShowNeedReviewCommand implements IBotCommandHandler {
	constructor(
		private readonly gitlabService: GitlabService,
		private readonly subscriptionRepo: ISubscriptionRepository
	) {}

	get botCommand(): BotCommand {
		return {
			command: 'show_need_review',
			description: 'Показать MR-ы, куда звали на реву',
		};
	}

	async handler(
		ctx: NarrowedContext<
			Scenes.SceneContext<Scenes.SceneSessionData>,
			Update.MessageUpdate
		>
	) {
		const { projects } = await this.subscriptionRepo.getUserSubscriptions(
			'user'
		);
		const reviewCalls = [];

		for (const { id } of projects) {
			const projectReviewCalls = await this.gitlabService.getProjectReviewCalls(
				id
			);

			reviewCalls.push(...projectReviewCalls);
		}

		return ctx.replyWithMarkdownV2(
			`*${dictionary.commands.whereYouWereMentioned}*`
		);
	}
}

export { ShowNeedReviewCommand };

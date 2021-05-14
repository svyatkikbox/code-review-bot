import { NarrowedContext, Scenes } from 'telegraf';
import { BotCommand, Update } from 'telegraf/typings/core/types/typegram';
import { IProjectRepository } from '../gitlab/repositories/projects/repository-interface';
import { CommentEvent } from '../gitlab/repositories/types';
import { ISubscriptionRepository } from '../subscription/repository-interface';
import { IBotCommandHandler } from './bot-command-handler-interface';

class ShowNeedReviewCommand implements IBotCommandHandler {
	constructor(
		private readonly ProjectRepo: IProjectRepository,
		private readonly SubscriptionRepo: ISubscriptionRepository
	) {}

	get botCommand(): BotCommand {
		return {
			command: 'show_need_review',
			description: 'Показать MR-ы за последние 14 дней, куда звали на реву',
		};
	}

	async handler(
		ctx: NarrowedContext<
			Scenes.SceneContext<Scenes.SceneSessionData>,
			Update.MessageUpdate
		>
	) {
		const { projects } = await this.SubscriptionRepo.getUserSubscriptions(
			'user'
		);
		const reviewCalls: CommentEvent[] = [];

		for (const { id } of projects) {
			const projectReviewCalls = await this.ProjectRepo.getProjectReviewCalls(
				id
			);

			reviewCalls.push(...projectReviewCalls);
		}

		return ctx.replyWithMarkdownV2('*42*');
	}
}

export { ShowNeedReviewCommand };

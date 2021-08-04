import { IMergeRequestRepository } from '../../gitlab/merge-requests/repository-interface';
import { NarrowedContext, Scenes } from 'telegraf';
import { BotCommand, Update } from 'telegraf/typings/core/types/typegram';

import { dictionary } from '../../dictionary';
import { MergeRequest } from '../../gitlab/types';
import { ISubscriptionRepository } from '../subscription/repository-interface';
import { IBotCommandHandler } from './command-handler-interface';
import { IRenderStrategy } from '../markup/render-strategy-interface';

class ShowMyOpenMergeRequests implements IBotCommandHandler {
	constructor(
		private readonly mergeRequestRepo: IMergeRequestRepository,
		private readonly subscriptionRepo: ISubscriptionRepository,
		private readonly renderMarkup: IRenderStrategy
	) {}

	get botCommand(): BotCommand {
		return {
			command: 'show_my_open_merge_requests',
			description: 'Мои недоделанные MR-ы',
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
		const myOpenMrs: MergeRequest[] = [];

		for (const { id } of projects) {
			const myProjectMrs =
				await this.mergeRequestRepo.getProjectUserMergeRequests(id, 'svyat');

			myOpenMrs.push(...myProjectMrs);
		}

		if (myOpenMrs.length) {
			const markup = this.renderMarkup.render(myOpenMrs);
			return ctx.replyWithHTML(markup, { disable_web_page_preview: true });
		} else {
			return ctx.replyWithMarkdownV2(`*${dictionary.commands.emptyMrs}`);
		}
	}
}

export { ShowMyOpenMergeRequests };

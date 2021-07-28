import { IMergeRequestRepository } from 'src/gitlab/merge-requests/repository-interface';
import { NarrowedContext, Scenes } from 'telegraf';
import { BotCommand, Update } from 'telegraf/typings/core/types/typegram';

import { dictionary } from '../../dictionary';
import { IProjectRepository } from '../../gitlab/projects/repository-interface';
import { MergeRequest } from '../../gitlab/types';
import { ISubscriptionRepository } from '../subscription/repository-interface';
import { IBotCommandHandler } from './command-handler-interface';

class ShowMyOpenMergeRequests implements IBotCommandHandler {
	constructor(
		private readonly MergeRequestRepo: IMergeRequestRepository,
		private readonly SubscriptionRepo: ISubscriptionRepository
	) {}

	get botCommand(): BotCommand {
		return {
			command: 'show_my_open_merge_requests',
			description: 'Мои недоделанные MR-ы',
		};
	}

	renderMarkupForReply(myOpenMrs: MergeRequest[]): string {
		let markup = `<b>${dictionary.commands.yourMrs}</b>\n`;

		for (const mrData of myOpenMrs) {
			const { webUrl, title, upvotes, downvotes } = mrData;
			markup += `<a href="${webUrl}">${title}</a> 👍 ${upvotes} 👎 ${downvotes}\n`;
		}

		return markup;
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
		const myOpenMrs: MergeRequest[] = [];

		for (const { id } of projects) {
			const myProjectMrs =
				await this.MergeRequestRepo.getProjectUserMergeRequests(id, 'svyat');

			myOpenMrs.push(...myProjectMrs);
		}

		if (myOpenMrs.length) {
			const markup = this.renderMarkupForReply(myOpenMrs);
			return ctx.replyWithHTML(markup, { disable_web_page_preview: true });
		} else {
			return ctx.replyWithMarkdownV2(`*${dictionary.commands.emptyMrs}`);
		}
	}
}

export { ShowMyOpenMergeRequests };

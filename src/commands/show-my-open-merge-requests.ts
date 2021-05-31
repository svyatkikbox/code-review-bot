import { NarrowedContext, Scenes } from 'telegraf';
import { BotCommand, Update } from 'telegraf/typings/core/types/typegram';
import { IProjectRepository } from '../gitlab/repositories/projects/repository-interface';
import { MergeRequest } from '../gitlab/repositories/types';
import { ISubscriptionRepository } from '../subscription/repository-interface';
import { IBotCommandHandler } from './bot-command-handler-interface';

class ShowMyOpenMergeRequests implements IBotCommandHandler {
	constructor(
		private readonly ProjectRepo: IProjectRepository,
		private readonly SubscriptionRepo: ISubscriptionRepository
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
		const { projects } = await this.SubscriptionRepo.getUserSubscriptions(
			'user'
		);
		const myOpenMrs: MergeRequest[] = [];

		for (const { id } of projects) {
			const myProjectMrs = await this.ProjectRepo.getProjectUserMergeRequests(
				id,
				'svyat'
			);

			myOpenMrs.push(...myProjectMrs);
		}

		console.log(myOpenMrs);
		console.log(myOpenMrs.length);

		if (myOpenMrs.length) {
			return ctx.replyWithMarkdownV2(`*Your open MRs*`);
		} else {
			return ctx.replyWithMarkdownV2(
				`*Ты либо красава и все порешал, либо нихуя не делал*`
			);
		}
	}
}

export { ShowMyOpenMergeRequests };

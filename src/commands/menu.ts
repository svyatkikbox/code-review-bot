import { NarrowedContext, Scenes } from 'telegraf';
import { KeyboardButton } from 'telegraf/typings/core/types/typegram';
import { BotCommand, Update } from 'typegram';
import { IBotCommandHandler } from './bot-command-handler-interface';

class MenuCommand implements IBotCommandHandler {
	get botCommand(): BotCommand {
		return {
			command: 'menu',
			description: 'Вызвать меню бота',
		};
	}

	async handler(
		ctx: NarrowedContext<
			Scenes.SceneContext<Scenes.SceneSessionData>,
			Update.MessageUpdate
		>
	) {
		const showNeedReviewsBtn: KeyboardButton = {
			text: 'Куда позвали на ревью',
		};
		const keyboard = [showNeedReviewsBtn];

		return ctx.telegram.sendMessage(ctx.message.chat.id, 'Menu', {
			reply_markup: { keyboard: [keyboard], resize_keyboard: true },
		});
	}
}

export { MenuCommand };

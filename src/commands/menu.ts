import { NarrowedContext, Scenes } from 'telegraf';
import { BotCommand, Update } from 'typegram';

import { menuKeyboard } from '../keyboards/bot-menu';
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
		return ctx.telegram.sendMessage(ctx.message.chat.id, 'Menu', {
			reply_markup: { keyboard: [menuKeyboard], resize_keyboard: true },
		});
	}
}

export { MenuCommand };

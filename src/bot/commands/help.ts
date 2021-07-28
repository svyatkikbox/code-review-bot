import { NarrowedContext, Scenes } from 'telegraf';
import { BotCommand, Update } from 'typegram';
import { IBotCommandHandler } from './command-handler-interface';

class HelpCommand implements IBotCommandHandler {
	get botCommand(): BotCommand {
		return {
			command: 'help',
			description: 'Показать справочную инфу',
		};
	}

	async handler(
		ctx: NarrowedContext<
			Scenes.SceneContext<Scenes.SceneSessionData>,
			Update.MessageUpdate
		>
	) {
		return ctx.reply('heeeeeeelp');
	}
}

export { HelpCommand };

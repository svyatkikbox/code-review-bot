import { NarrowedContext, Scenes } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { BotCommand } from 'typegram';

const help: BotCommand = {
	command: 'help',
	description: 'Показать справочную инфу',
};

const helpHandler = async (
	ctx: NarrowedContext<
		Scenes.SceneContext<Scenes.SceneSessionData>,
		Update.MessageUpdate
	>
) => {
	return ctx.reply('heeeeeeelp');
};

export { help, helpHandler };

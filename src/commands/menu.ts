import { NarrowedContext, Scenes } from 'telegraf';
import {
	BotCommand,
	KeyboardButton,
	Update,
} from 'telegraf/typings/core/types/typegram';

const menu: BotCommand = {
	command: 'menu',
	description: 'Вызвать меню бота',
};

const menuHandler = async (
	ctx: NarrowedContext<
		Scenes.SceneContext<Scenes.SceneSessionData>,
		Update.MessageUpdate
	>
) => {
	const showNeedReviewsBtn: KeyboardButton = { text: 'Куда позвали на ревью' };
	const keyboard = [showNeedReviewsBtn];

	return ctx.telegram.sendMessage(ctx.message.chat.id, 'Menu', {
		reply_markup: { keyboard: [keyboard], resize_keyboard: true },
	});
};

export { menu, menuHandler };

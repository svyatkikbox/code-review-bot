import { ProjectRepo } from '../app';
import { NarrowedContext, Scenes } from 'telegraf';
import { BotCommand, Update } from 'telegraf/typings/core/types/typegram';

// TODO подумать над периодом, но не упарываться в кастомизации, ибо нехуй
const showNeedReview: BotCommand = {
	command: 'show_need_review',
	description: 'Показать MR-ы за последние 7 дней, куда звали на реву',
};

const showNeedReviewHandler = async (
	ctx: NarrowedContext<
		Scenes.SceneContext<Scenes.SceneSessionData>,
		Update.MessageUpdate
	>
) => {
	const query = {
		projectId: 1,
		targetType: 'note',
		action: 'commented',
	};
	console.log(query);

	const reviewCalls = await ProjectRepo.getProjectReviewCalls(query);

	console.log(reviewCalls);
	return ctx.reply('шото нашлось');
};

export { showNeedReview, showNeedReviewHandler };

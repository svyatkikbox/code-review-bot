import { Scenes } from 'telegraf';
import { UserRepo } from '../../../app';
import { dictionary } from '../../../dictionary';
import { UserState } from '../../../gitlab/repositories/types';

const stepId = 'REGISTRATION';
const findUser = new Scenes.BaseScene<Scenes.SceneContext>(stepId);

findUser.enter(ctx => ctx.reply(dictionary.steps.enterUserName));
findUser.command('exit', ctx => ctx.scene.leave());
findUser.on('text', async ctx => {
	const username = ctx.message.text;
	let user = null;

	try {
		user = await UserRepo.getUserByUsername(username);
	} catch (error) {
		console.error(error);
		return ctx.reply(dictionary.smthWentWrong);
	}

	if (!user) {
		return ctx.reply(dictionary.steps.userNotExists);
	}

	if (user?.state !== UserState.ACTIVE) {
		return ctx.reply(dictionary.steps.userIsNotActive);
	}

	await ctx.reply(dictionary.steps.userWasFound);

	return ctx.scene.enter('FindProjects');
});

export const findUserStep = {
	stepId,
	step: findUser,
};

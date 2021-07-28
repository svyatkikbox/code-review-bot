import { Scenes } from 'telegraf';
import { userRepo } from '../../../../app';
import { dictionary } from '../../../../dictionary';
import { UserState } from '../../../../gitlab/types';

const stepId = 'REGISTRATION';
const findUser = new Scenes.BaseScene<Scenes.SceneContext>(stepId);

findUser.enter(ctx => ctx.reply(dictionary.steps.enterUserName));
findUser.command('exit', ctx => ctx.scene.leave());
findUser.on('text', async ctx => {
	const userName = ctx.message.text;
	let user = null;

	try {
		user = await userRepo.getByUsername(userName);
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

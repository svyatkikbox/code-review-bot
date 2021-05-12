import { Scenes } from 'telegraf';

import { UserRepo } from '../../../app';
import { UserState } from '../../../gitlab/repositories/types';

const stepId = 'REGISTRATION';
const findUser = new Scenes.BaseScene<Scenes.SceneContext>(stepId);

findUser.enter(ctx => ctx.reply('Enter username'));
findUser.leave(ctx => ctx.reply('Bye'));
findUser.command('exit', ctx => ctx.scene.leave());
findUser.on('text', async ctx => {
	const username = ctx.message.text;
	let userData = null;

	try {
		userData = await UserRepo.getUserByUsername(username);
	} catch (error) {
		console.error('Cannot find user');
		return ctx.reply('Cannot find user');
	}

	if (userData?.state !== UserState.ACTIVE) {
		console.log('oooooops');
		console.error('Looser is not active');
		return ctx.reply('User is not active');
	}

	await ctx.reply('User was found');

	return ctx.scene.enter('ExploreProject');
});

export const findUserStep = {
	stepId,
	step: findUser,
};

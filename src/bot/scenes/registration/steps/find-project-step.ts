import { Scenes } from 'telegraf';

import { ProjectRepo } from '../../../../app';

const stepId = 'FindProjects';
const findProjects = new Scenes.BaseScene<Scenes.SceneContext>(stepId);

findProjects.enter(ctx => ctx.reply('Enter project name'));
findProjects.leave(ctx => ctx.reply('Bye'));
findProjects.command('exit', ctx => ctx.scene.leave());
findProjects.on('text', async ctx => {
	const projectName = ctx.message.text;
	let projectData = null;

	try {
		projectData = await ProjectRepo.getProjectByName(projectName);
		console.log(projectData);
	} catch (error) {
		return ctx.reply('Cannot find project');
	}

	if (!projectData) {
		return ctx.reply('Cannot find project');
	}

	await ctx.reply('Project was found');
	return ctx.scene.leave();
});

export const findProjectsStep = { stepId, step: findProjects };

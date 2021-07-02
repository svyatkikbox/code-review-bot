import { NarrowedContext, Scenes } from 'telegraf';
import { BotCommand, Update } from 'typegram';
import { BotScene } from '../scenes/types';
import { IBotCommandHandler } from './bot-command-handler-interface';

class RegistrationCommand implements IBotCommandHandler {
	constructor(private readonly registrationScene: BotScene) {}
	get botCommand(): BotCommand {
		return {
			command: 'register',
			description: 'Визард регистрации в боте',
		};
	}

	async handler(
		ctx: NarrowedContext<
			Scenes.SceneContext<Scenes.SceneSessionData>,
			Update.MessageUpdate
		>
	) {
		return ctx.scene.enter(this.registrationScene.enteringStepId);
	}
}

export { RegistrationCommand };

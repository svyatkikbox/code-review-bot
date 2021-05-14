// composition root
// TODO еще шушуть и захошица прикручивать di container
import { Scenes, session, Telegraf, Telegram } from 'telegraf';
import {
	help,
	menu,
	menuHandler,
	registration,
	showNeedReview,
	showNeedReviewHandler,
} from './commands/all';
import config from './config';
import { GitlabAPI } from './gitlab/gitlab-api';
import { httpService } from './gitlab/http-service';
import { ProjectRepository } from './gitlab/repositories/projects/repository';
import { UserRepository } from './gitlab/repositories/users/repository';
import { SubscriptionRepository } from './subscription/repository';
import { registrationScene } from './scenes/registration/registration-scene';
import { ShowNeedReview } from './commands/show-need-review';

const { BOT_TOKEN, PORT, WEBHOOK_URL } = config;
const bot = new Telegraf<Scenes.SceneContext>(BOT_TOKEN);
const tg = new Telegram(BOT_TOKEN);

bot.telegram.setWebhook(`${WEBHOOK_URL}/bot${BOT_TOKEN}:${PORT}`);

const gitlabAPI = new GitlabAPI(httpService);
const UserRepo = new UserRepository(gitlabAPI);
const ProjectRepo = new ProjectRepository(gitlabAPI);
const SubscriptionRepo = new SubscriptionRepository();
const showNeedReviewCommand = new ShowNeedReview(ProjectRepo, SubscriptionRepo);

tg.setMyCommands([help, menu, registration, showNeedReviewCommand.botCommand]);

const stage = new Scenes.Stage<Scenes.SceneContext>([
	...registrationScene.steps,
]);

bot.use(session());
bot.use(stage.middleware());

bot.command(registration.command, ctx =>
	ctx.scene.enter(registrationScene.enteringStepId)
);
bot.command(menu.command, ctx => menuHandler(ctx));
bot.command(showNeedReviewCommand.botCommand.command, ctx =>
	showNeedReviewCommand.handler(ctx)
);
bot.hears('Куда позвали на ревью', ctx => showNeedReviewCommand.handler(ctx));

export { bot, UserRepo, ProjectRepo, SubscriptionRepo };

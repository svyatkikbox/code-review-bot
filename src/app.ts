import { Scenes, session, Telegraf, Telegram } from 'telegraf';
import { HelpCommand } from './bot/commands/help';
import { MenuCommand } from './bot/commands/menu';
import { RegistrationCommand } from './bot/commands/registration';
import { ShowMyOpenMergeRequests } from './bot/commands/show-my-open-merge-requests';
import { ShowNeedReviewCommand } from './bot/commands/show-need-review';
import { SqlDatabase } from './bot/database/database';
import { registrationScene } from './bot/scenes/registration/registration-scene';
import { SqlSubscriptionRepository } from './bot/subscription/repository';
import config from './config';
import { dictionary } from './dictionary';
import { GitlabAPI } from './gitlab/gitlab-api';
import { httpService } from './gitlab/http-service';
import { MergeRequestRepository } from './gitlab/merge-requests/repository';
import { ProjectRepository } from './gitlab/projects/repository';
import { UserRepository } from './gitlab/users/repository';
import { MergeRequestMap } from './mappers/merge-request-map';

const { BOT_TOKEN } = config;
const bot = new Telegraf<Scenes.SceneContext>(BOT_TOKEN);
const tg = new Telegram(BOT_TOKEN);

const gitlabAPI = new GitlabAPI(httpService, {
	baseURL: config.GITLAB_URL,
	headers: {
		'PRIVATE-TOKEN': config.GITLAB_TOKEN,
	},
});

const UserRepo = new UserRepository(gitlabAPI);
const ProjectRepo = new ProjectRepository(gitlabAPI);
const MergeRequestRepo = new MergeRequestRepository(
	gitlabAPI,
	new MergeRequestMap()
);

const database = new SqlDatabase(config.DATABASE_URL);

const SqlSubscriptionRepo = new SqlSubscriptionRepository(database);

const showNeedReviewCommand = new ShowNeedReviewCommand(
	ProjectRepo,
	SqlSubscriptionRepo
);
const showMyOpenMrsCommand = new ShowMyOpenMergeRequests(
	MergeRequestRepo,
	SqlSubscriptionRepo
);
const registrationCommand = new RegistrationCommand(registrationScene);
const helpCommand = new HelpCommand();
const menuCommand = new MenuCommand();

tg.setMyCommands([
	helpCommand.botCommand,
	menuCommand.botCommand,
	registrationCommand.botCommand,
	showNeedReviewCommand.botCommand,
	showMyOpenMrsCommand.botCommand,
]);

const stage = new Scenes.Stage<Scenes.SceneContext>([
	...registrationScene.steps,
]);

bot.use(session());
bot.use(stage.middleware());

bot.command(helpCommand.botCommand.command, ctx => helpCommand.handler(ctx));
bot.command(menuCommand.botCommand.command, ctx => menuCommand.handler(ctx));
bot.command(registrationCommand.botCommand.command, ctx =>
	registrationCommand.handler(ctx)
);
bot.command(showNeedReviewCommand.botCommand.command, ctx =>
	showNeedReviewCommand.handler(ctx)
);
bot.command(showMyOpenMrsCommand.botCommand.command, ctx =>
	showMyOpenMrsCommand.handler(ctx)
);

bot.hears(dictionary.buttons.showNeedReviews, ctx =>
	showNeedReviewCommand.handler(ctx)
);
bot.hears(dictionary.buttons.showMyOpenMrsCommand, ctx =>
	showMyOpenMrsCommand.handler(ctx)
);

export { bot, UserRepo, ProjectRepo, SqlSubscriptionRepo };

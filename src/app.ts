import { Scenes, session, Telegraf, Telegram } from 'telegraf';
import { HelpCommand } from './commands/help';
import { MenuCommand } from './commands/menu';
import { RegistrationCommand } from './commands/registration';
import { ShowMyOpenMergeRequests } from './commands/show-my-open-merge-requests';
import { ShowNeedReviewCommand } from './commands/show-need-review';
import config from './config';
import { SqlDatabase } from './database';
import { dictionary } from './dictionary';
import { GitlabAPI } from './gitlab/gitlab-api';
import { httpService } from './gitlab/http-service';
import { ProjectRepository } from './gitlab/repositories/projects/repository';
import { UserRepository } from './gitlab/repositories/users/repository';
import { registrationScene } from './scenes/registration/registration-scene';
import { SqlSubscriptionRepository } from './subscription/repository';

const { BOT_TOKEN } = config;
const bot = new Telegraf<Scenes.SceneContext>(BOT_TOKEN);
const tg = new Telegram(BOT_TOKEN);

const gitlabAPI = new GitlabAPI(httpService);

const UserRepo = new UserRepository(gitlabAPI);
const ProjectRepo = new ProjectRepository(gitlabAPI);
const SqlSubscriptionRepo = new SqlSubscriptionRepository(SqlDatabase);

const showNeedReviewCommand = new ShowNeedReviewCommand(
	ProjectRepo,
	SqlSubscriptionRepo
);
const showMyOpenMrsCommand = new ShowMyOpenMergeRequests(
	ProjectRepo,
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

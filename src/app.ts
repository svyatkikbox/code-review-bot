// composition root
// TODO еще шушуть и захошица прикручивать di container
import { Scenes, session, Telegraf, Telegram } from 'telegraf';
import config from './config';
import { GitlabAPI } from './gitlab/gitlab-api';
import { httpService } from './gitlab/http-service';
import { ProjectRepository } from './gitlab/repositories/projects/repository';
import { UserRepository } from './gitlab/repositories/users/repository';
import { SubscriptionRepository } from './subscription/repository';
import { registrationScene } from './scenes/registration/registration-scene';
import { ShowNeedReviewCommand } from './commands/show-need-review';
import { RegistrationCommand } from './commands/registration';
import { HelpCommand } from './commands/help';
import { MenuCommand } from './commands/menu';
import { ShowMyOpenMergeRequests } from './commands/show-my-open-merge-requests';

const { BOT_TOKEN } = config;
const bot = new Telegraf<Scenes.SceneContext>(BOT_TOKEN);
const tg = new Telegram(BOT_TOKEN);

const gitlabAPI = new GitlabAPI(httpService);

const UserRepo = new UserRepository(gitlabAPI);
const ProjectRepo = new ProjectRepository(gitlabAPI);
const SubscriptionRepo = new SubscriptionRepository();

const showNeedReviewCommand = new ShowNeedReviewCommand(
	ProjectRepo,
	SubscriptionRepo
);
const showMyOpenMrsCommand = new ShowMyOpenMergeRequests(
	ProjectRepo,
	SubscriptionRepo
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

// TODO переделать на фабрику команд. Тут везде все одинаковое
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
// TODO связать клавиатурные кнопки с командами и обработчиками
bot.hears('Куда позвали на ревью', ctx => showNeedReviewCommand.handler(ctx));
bot.hears('Мои недоделанные MR-ы', ctx => showMyOpenMrsCommand.handler(ctx));

export { bot, UserRepo, ProjectRepo, SubscriptionRepo };

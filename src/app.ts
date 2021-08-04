import { Scenes, session, Telegraf, Telegram } from 'telegraf';
import { HelpCommand } from './bot/commands/help';
import { MenuCommand } from './bot/commands/menu';
import { RegistrationCommand } from './bot/commands/registration';
import { ShowMyOpenMergeRequests } from './bot/commands/show-my-open-merge-requests';
import { ShowNeedReviewCommand } from './bot/commands/show-need-review';
import { SqlDatabase } from './bot/database/database';
import { RenderMergeRequestsStrategy } from './bot/markup/render-merge-requests-strategy';
import { RenderReviewCallsStrategy } from './bot/markup/render-review-calls-strategy';
import { registrationScene } from './bot/scenes/registration/registration-scene';
import { SqlSubscriptionRepository } from './bot/subscription/repository';
import config from './config';
import { dictionary } from './dictionary';
import { AwardRepository } from './gitlab/awards/repository';
import { GitlabService } from './gitlab/gitlab-service';
import { HttpService } from './gitlab/http-service';
import { MergeRequestRepository } from './gitlab/merge-requests/repository';
import { NoteRepository } from './gitlab/notes/repository';
import { ProjectRepository } from './gitlab/projects/repository';
import { UserRepository } from './gitlab/users/repository';
import { AwardMap } from './mappers/award-mapper';
import { MergeRequestMap } from './mappers/merge-request-mapper';
import { NoteMap } from './mappers/note-mapper';
import { SubscriptionMap } from './mappers/subscription-mapper';

const { BOT_TOKEN } = config;
const bot = new Telegraf<Scenes.SceneContext>(BOT_TOKEN);
const tg = new Telegram(BOT_TOKEN);

const database = new SqlDatabase(config.DATABASE_URL);

const gitlabAPI = new HttpService({
	baseURL: config.GITLAB_URL,
	headers: {
		'PRIVATE-TOKEN': config.GITLAB_TOKEN,
	},
});

const userRepo = new UserRepository(gitlabAPI);
const projectRepo = new ProjectRepository(gitlabAPI);
const mergeRequestRepo = new MergeRequestRepository(
	gitlabAPI,
	new MergeRequestMap()
);
const awardRepo = new AwardRepository(gitlabAPI, new AwardMap());
const noteRepo = new NoteRepository(gitlabAPI, new NoteMap());
const sqlSubscriptionRepo = new SqlSubscriptionRepository(
	database,
	new SubscriptionMap()
);

const gitlabService = new GitlabService(mergeRequestRepo, noteRepo, awardRepo);

const showNeedReviewCommand = new ShowNeedReviewCommand(
	gitlabService,
	sqlSubscriptionRepo,
	new RenderReviewCallsStrategy()
);
const showMyOpenMrsCommand = new ShowMyOpenMergeRequests(
	mergeRequestRepo,
	sqlSubscriptionRepo,
	new RenderMergeRequestsStrategy()
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

export { bot, userRepo, projectRepo, sqlSubscriptionRepo, gitlabService };

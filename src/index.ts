import { bot } from './app';

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
process.on('unhandledRejection', err => {
	console.error(err);
	bot.stop('SIGTERM');
});

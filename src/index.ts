import { bot } from './app';

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));

process.once('SIGTERM', () => bot.stop('SIGTERM'));

process.once('beforeExit', () => console.log('about to exit '));

process.on('exit', () => bot.stop('exit'));

process.on('unhandledRejection', err => {
	console.error('unhandledRejection', { err });
	bot.stop('unhandledRejection');
	process.exit(1);
});

process.on('uncaughtException', err => {
	console.log(`Uncaught Exception: ${err.message}`);
	process.exit(1);
});

const dotenv = require('dotenv');
dotenv.config();

export default Object.freeze({
	BOT_TOKEN: process.env.BOT_TOKEN as string,
	GITLAB_URL: process.env.GITLAB_URL as string,
	GITLAB_TOKEN: process.env.GITLAB_TOKEN as string,

	URL: 'https://short-dodo-14.loca.lt',
	PORT: process.env.PORT || 5000,

	// TODO перекинуть этот хардкод на взаимодействие с пользователем и сохранение в БД
	// шоб можно было отписку/подписку добавлять на проекты
	PROJECTS: [
		{ name: 'uKit', id: 1 },
		{ name: 'ira', id: 206 },
		{ name: 'spasi', id: 210 },
		{ name: 'saga', id: 212 },
	],
});

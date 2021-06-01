const dotenv = require('dotenv');
dotenv.config();

export default Object.freeze({
	BOT_TOKEN: process.env.BOT_TOKEN as string,
	GITLAB_URL: process.env.GITLAB_URL as string,
	GITLAB_TOKEN: process.env.GITLAB_TOKEN as string,

	APP_URL: process.env.APP_URL as string,
	WEBHOOK_URL: process.env.WEBHOOK_URL as string,
	PORT: parseInt(process.env.PORT as string, 10),
});

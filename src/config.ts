const dotenv = require('dotenv');
dotenv.config();

export default Object.freeze({
	BOT_TOKEN: process.env.BOT_TOKEN as string,
	GITLAB_URL: process.env.GITLAB_URL as string,
	GITLAB_TOKEN: process.env.GITLAB_TOKEN as string,

	WEBHOOK_URL: 'https://dull-snake-35.loca.lt',
	PORT: process.env.PORT || 5000,
});

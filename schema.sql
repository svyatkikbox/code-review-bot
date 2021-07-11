CREATE TABLE IF NOT EXISTS Users
(
	id SERIAL PRIMARY KEY,
	tg_username VARCHAR(255) NOT NULL,
	gitlab_username VARCHAR(255) NOT NULL,
	chat_id integer NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS Subscription
(
	id SERIAL PRIMARY KEY,
	user_id integer NOT NULL,
	projects integer[] NOT NULL
);
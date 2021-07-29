CREATE TABLE IF NOT EXISTS Users
(
	id SERIAL PRIMARY KEY,
	tg_username VARCHAR(255) NOT NULL,
	gitlab_username VARCHAR(255) NOT NULL,
	chat_id integer NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS Subscriptions
(
	id SERIAL PRIMARY KEY,
	user_id integer NOT NULL,
	projects integer[] NOT NULL
);

CREATE TABLE IF NOT EXISTS MergeRequests
(
	id SERIAL PRIMARY KEY,
	title VARCHAR(255),
	upvotes integer NOT NULL,
	downvotes integer NOT NULL,
	web_url VARCHAR(255) NOT NULL,
	labels VARCHAR(255)[]
);
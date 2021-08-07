CREATE TABLE IF NOT EXISTS users
(
	id SERIAL PRIMARY KEY,
	tg_username VARCHAR(255) NOT NULL,
	gitlab_username VARCHAR(255) NOT NULL,
	chat_id integer NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS subscriptions
(
	id SERIAL PRIMARY KEY,
	user_id integer REFERENCES users,
	project_ids integer[] NOT NULL
);

CREATE TABLE IF NOT EXISTS merge_requests_data_cache
(
	id SERIAL PRIMARY KEY,
	project_id integer NOT NULL,
	data_cache json NOT NULL
);
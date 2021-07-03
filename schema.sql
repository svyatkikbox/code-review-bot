CREATE TABLE IF NOT EXISTS Users
(
	id SERIAL PRIMARY KEY,
	TgUsername VARCHAR(255) NOT NULL,
	GitlabUsername VARCHAR(255) NOT NULL,
	ChatId integer NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS Subscription
(
	id SERIAL PRIMARY KEY,
	UserId integer NOT NULL,
	ProjectIds integer[] NOT NULL
);
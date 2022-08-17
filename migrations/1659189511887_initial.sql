-- Up Migration
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
	id BIGINT PRIMARY KEY NOT NULL,
	username VARCHAR(37),
	avatar VARCHAR(34)
);

CREATE TABLE user_tokens (
	token TEXT PRIMARY KEY NOT NULL UNIQUE,
	user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	expires TIMESTAMP NOT NULL
);

CREATE TABLE servers (
	id BIGINT PRIMARY KEY NOT NULL UNIQUE,
	owner_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	server_name VARCHAR(100),
	icon VARCHAR(34)
);

CREATE TABLE moderators (
	server_id BIGINT REFERENCES servers(id) ON DELETE CASCADE,
	user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
	readonly BOOLEAN NOT NULL DEFAULT false,
	UNIQUE(server_id, user_id)
);

CREATE TABLE server_members (
	server_id BIGINT REFERENCES servers(id) ON DELETE CASCADE,
	user_id BIGINT NOT NULL,
	username VARCHAR(37),
	avatar VARCHAR(34),
	UNIQUE(server_id, user_id)
);
CREATE INDEX server_member_index ON server_members (server_id, user_id);

CREATE TABLE member_notes (
	id UUID PRIMARY KEY NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
	server_id BIGINT REFERENCES servers(id) ON DELETE CASCADE,
	user_id BIGINT NOT NULL,
	title VARCHAR(140) NOT NULL,
	note_type VARCHAR(20) NOT NULL DEFAULT 'note',
	body TEXT,
	created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
	resolved BOOLEAN NOT NULL DEFAULT false,
	expires TIMESTAMP
);

-- Down Migration
DROP TABLE member_notes;
DROP INDEX server_member_index;
DROP TABLE server_members;
DROP TABLE moderators;
DROP TABLE servers;
DROP TABLE user_tokens;
DROP TABLE users;


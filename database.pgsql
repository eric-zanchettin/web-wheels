-- USERS TABLE

CREATE TABLE users (
	id SERIAL PRIMARY KEY,
  name TEXT,
  birth_date TIMESTAMP WITHOUT TIME ZONE,
  email TEXT,
  cpf TEXT,
  password TEXT,
  reset_token TEXT
)

-- SESSIONS TABLE

CREATE TABLE sessions (
	sid VARCHAR NOT NULL COLLATE "default",
  sess JSON NOT NULL,
  expire TIMESTAMP(6) NOT NULL
)
WITH(OIDS=FALSE);

ALTER TABLE session ADD CONSTRAINT session_pkey PRIMARY KEY (sid) NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX IDX_session_expire ON session(expire);

-- CREATES THE USER ADRESS TABLE

CREATE TABLE users_address (
	id SERIAL PRIMARY KEY,
  cep TEXT,
  road TEXT,
  neighborhood TEXT,
  city TEXT,
  complement TEXT,
  reference TEXT,
	user_id INT,
  CONSTRAINT fk_user_id
  	FOREIGN KEY(user_id)
  		REFERENCES users(id)
);

-- RESTARTS SEQUENCE OF AN PRIMARY KEY

ALTER SEQUENCE product_id_seq RESTART WITH 1453
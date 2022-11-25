-- migrate:up
ALTER TABLE users 
    ADD CONSTRAINT email UNIQUE (email);

-- migrate:down


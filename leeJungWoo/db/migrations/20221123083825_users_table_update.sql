-- migrate:up
alter table users add unique index (email);

-- migrate:down


-- migrate:up
alter table likes add constraint unique (user_id, post_id);

-- migrate:down


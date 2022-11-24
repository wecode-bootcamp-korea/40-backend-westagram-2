-- migrate:up
CREATE TABLE IF NOT EXISTS likes (
    id INT NOT NULL AUTO_INCREMENT,
    likes_user INT NOT NULL,
    likes_post INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (likes_user) REFERENCES users(id),
    FOREIGN KEY (likes_post) REFERENCES posts(id)
);

-- migrate:down
DROP TABLE likes;

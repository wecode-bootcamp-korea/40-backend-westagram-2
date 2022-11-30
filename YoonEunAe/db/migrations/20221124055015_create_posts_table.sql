-- migrate:up
CREATE TABLE posts (
          id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(1000) NOT NULL,
          image_url VARCHAR(1000) NULL,
          content VARCHAR(1000) NULL,
          user_id INT NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          CONSTRAINT posts_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id)

);

-- migrate:down
DROP TABLE posts;
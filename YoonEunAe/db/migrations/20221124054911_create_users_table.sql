-- migrate:up
CREATE TABLE users (
          id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(1000) NOT NULL,
          email VARCHAR(1000) NOT NULL,
          profile_image VARCHAR(1000) NULL,    
          password VARCHAR(1000) NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- migrate:down
DROP TABLE users;
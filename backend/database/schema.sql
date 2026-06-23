-- ============================================================
--  Rezonans Sanat ve Kişisel Gelişim Merkezi — Veritabanı Şeması
--  Sürüm: 2.0  |  Charset: utf8mb4
--
--  Kurulum:
--    cPanel phpMyAdmin → veritabanınızı seçin → Import → bu dosyayı seçin → Go
--
--  İlk giriş:
--    E-posta : admin@rezonansetimesgut
--    Şifre   : Admin123!
--    Giriş sonrası admin şifreyi değiştirmek zorundadır.
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ── users ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `users` (
  `id`                   INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `name`                 VARCHAR(120)  NOT NULL,
  `email`                VARCHAR(180)  NOT NULL UNIQUE,
  `password_hash`        VARCHAR(255)  NOT NULL,
  `role`                 ENUM('admin','teacher','student','veli') NOT NULL DEFAULT 'student',
  `student_id`           INT UNSIGNED  NULL DEFAULT NULL,
  `branch`               VARCHAR(80)   NULL DEFAULT NULL,
  `must_change_password` TINYINT(1)    NOT NULL DEFAULT 0,
  `created_at`           TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── students ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `students` (
  `id`               INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  `name`             VARCHAR(120)   NOT NULL,
  `branch`           VARCHAR(80)    NOT NULL,
  `category`         VARCHAR(80)    NULL DEFAULT NULL,
  `program`          VARCHAR(40)    NULL DEFAULT NULL,
  `age_group`        VARCHAR(20)    NULL DEFAULT NULL,
  `status`           VARCHAR(20)    NOT NULL DEFAULT 'Aktif',
  `veli_id`          INT UNSIGNED   NULL DEFAULT NULL,
  `teacher_id`       INT UNSIGNED   NULL DEFAULT NULL,
  `birth_date`       VARCHAR(20)    NULL DEFAULT NULL,
  `phone`            VARCHAR(20)    NULL DEFAULT NULL,
  `parent_name`      VARCHAR(100)   NULL DEFAULT NULL,
  `parent_phone`     VARCHAR(20)    NULL DEFAULT NULL,
  `lesson_day`       VARCHAR(20)    NULL DEFAULT NULL,
  `lesson_time`      VARCHAR(10)    NULL DEFAULT NULL,
  `start_date`       VARCHAR(20)    NULL DEFAULT NULL,
  `monthly_fee`      DECIMAL(10,2)  NULL DEFAULT NULL,
  `payment_day`      INT            NULL DEFAULT NULL,
  `duration_months`  INT            NULL DEFAULT NULL,
  `created_at`       TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── teachers ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `teachers` (
  `id`       INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `user_id`  INT UNSIGNED  NULL DEFAULT NULL,
  `name`     VARCHAR(120)  NOT NULL,
  `branch`   VARCHAR(80)   NOT NULL,
  `category` VARCHAR(80)   NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── sessions ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `sessions` (
  `id`         INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `user_id`    INT UNSIGNED  NOT NULL,
  `token`      VARCHAR(512)  NOT NULL UNIQUE,
  `expires_at` DATETIME      NOT NULL,
  `created_at` TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_token` (`token`(64)),
  INDEX `idx_user`  (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── evaluations ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `evaluations` (
  `id`           INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `student_id`   INT UNSIGNED  NOT NULL,
  `student_name` VARCHAR(120)  NOT NULL,
  `teacher_id`   INT UNSIGNED  NOT NULL,
  `teacher_name` VARCHAR(120)  NOT NULL,
  `month`        VARCHAR(30)   NOT NULL,
  `content`      TEXT          NOT NULL,
  `created_at`   DATE          NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── messages ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `messages` (
  `id`         INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `from_id`    INT UNSIGNED  NOT NULL,
  `from_name`  VARCHAR(120)  NOT NULL,
  `from_role`  VARCHAR(20)   NOT NULL,
  `to_id`      INT UNSIGNED  NULL DEFAULT NULL,
  `to_name`    VARCHAR(120)  NOT NULL,
  `channel`    VARCHAR(20)   NOT NULL DEFAULT 'direct',
  `subject`    VARCHAR(200)  NOT NULL,
  `body`       TEXT          NOT NULL,
  `is_read`    TINYINT(1)    NOT NULL DEFAULT 0,
  `created_at` DATE          NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── announcements ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `announcements` (
  `id`    INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(200)  NOT NULL,
  `body`  TEXT          NOT NULL,
  `date`  DATE          NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── attendance ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `attendance` (
  `id`           INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `student_id`   INT UNSIGNED  NOT NULL,
  `student_name` VARCHAR(120)  NOT NULL,
  `lesson`       VARCHAR(80)   NULL DEFAULT NULL,
  `date`         VARCHAR(20)   NOT NULL,
  `status`       VARCHAR(40)   NOT NULL DEFAULT 'Derse Gelmedi',
  `created_at`   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── payments ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `payments` (
  `id`           INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  `student_id`   INT UNSIGNED   NOT NULL,
  `student_name` VARCHAR(120)   NOT NULL,
  `amount`       DECIMAL(10,2)  NOT NULL,
  `due_date`     VARCHAR(20)    NOT NULL,
  `status`       VARCHAR(20)    NOT NULL DEFAULT 'Bekliyor',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── demo_requests ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `demo_requests` (
  `id`             INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `name`           VARCHAR(120)  NOT NULL,
  `phone`          VARCHAR(30)   NOT NULL,
  `email`          VARCHAR(180)  NOT NULL,
  `branch`         VARCHAR(80)   NOT NULL,
  `preferred_time` VARCHAR(80)   NULL DEFAULT NULL,
  `note`           TEXT          NULL DEFAULT NULL,
  `created_at`     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── products ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `products` (
  `id`          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `name`        VARCHAR(200)  NOT NULL,
  `category`    VARCHAR(80)   NOT NULL,
  `description` TEXT          NULL DEFAULT NULL,
  `image_url`   VARCHAR(500)  NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── weekly_schedule ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `weekly_schedule` (
  `id`           INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `day`          VARCHAR(20)   NOT NULL,
  `time_slot`    VARCHAR(10)   NOT NULL,
  `branch`       VARCHAR(120)  NOT NULL,
  `teacher_name` VARCHAR(120)  NOT NULL,
  `room`         VARCHAR(80)   NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── İlk admin kullanıcısı ────────────────────────────────────
-- Şifre: Admin123!  (bcrypt, cost=10)
-- İlk girişte must_change_password = 0 (admin zaten şifresini biliyor)
INSERT INTO `users` (`name`, `email`, `password_hash`, `role`, `must_change_password`)
VALUES (
  'Admin',
  'admin@rezonansetimesgut',
  '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'admin',
  0
);

SET FOREIGN_KEY_CHECKS = 1;

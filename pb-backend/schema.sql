-- Pinobite API Database Schema
-- MySQL Database Schema - Single Migration File
-- Run this file on your MySQL server: mysql -u user -p < schema.sql

SET FOREIGN_KEY_CHECKS = 0;
DROP DATABASE IF EXISTS pinob_db;
CREATE DATABASE pinob_db;
USE pinob_db;

-- Django built-in tables
CREATE TABLE `auth_group` (
    `id` integer AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `name` varchar(150) NOT NULL UNIQUE
);
CREATE TABLE `auth_group_permissions` (
    `id` integer AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `group_id` integer NOT NULL,
    `permission_id` integer NOT NULL
);
CREATE TABLE `auth_permission` (
    `id` integer AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `name` varchar(255) NOT NULL,
    `content_type_id` integer NOT NULL,
    `codename` varchar(100) NOT NULL
);
CREATE TABLE `auth_user` (
    `id` integer AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `password` varchar(128) NOT NULL,
    `last_login` datetime(6) NULL,
    `is_superuser` bool NOT NULL,
    `username` varchar(150) NOT NULL UNIQUE,
    `first_name` varchar(150) NOT NULL,
    `last_name` varchar(150) NOT NULL,
    `email` varchar(254) NOT NULL,
    `is_staff` bool NOT NULL,
    `is_active` bool NOT NULL,
    `date_joined` datetime(6) NOT NULL
);
CREATE TABLE `django_content_type` (
    `id` integer AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `app_label` varchar(100) NOT NULL,
    `model` varchar(100) NOT NULL
);
CREATE TABLE `django_migrations` (
    `id` integer AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `app` varchar(255) NOT NULL,
    `name` varchar(255) NOT NULL,
    `applied` datetime(6) NOT NULL
);
CREATE TABLE `django_session` (
    `session_key` varchar(40) NOT NULL PRIMARY KEY,
    `session_data` longtext NOT NULL,
    `expire_date` datetime(6) NOT NULL
);


-- API Application Tables

-- Category table
CREATE TABLE `api_category` (
    `id` bigint AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `name` varchar(100) NOT NULL,
    `image` varchar(100) NULL
);

-- Product table
CREATE TABLE `api_product` (
    `id` bigint AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `name` varchar(255) NOT NULL,
    `price` numeric(10, 2) NOT NULL,
    `original_price` numeric(10, 2) NULL,
    `rating` double precision NOT NULL,
    `review_count` integer NOT NULL,
    `image` varchar(100) NULL,
    `gallery` json NOT NULL,
    `description` longtext NOT NULL,
    `benefits` json NOT NULL,
    `nutrients` json NOT NULL,
    `is_top_rated` bool NOT NULL,
    `category` varchar(100) NOT NULL,
    `stock` integer NOT NULL,
    `model_3d` varchar(100) NULL,
    `theme_color` varchar(50) NULL,
    `orientation` varchar(100) NULL
);

-- Events table
CREATE TABLE `api_event` (
    `id` bigint AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `title` varchar(255) NOT NULL,
    `location` varchar(255) NOT NULL,
    `image` varchar(100) NULL,
    `summary` longtext NOT NULL,
    `full_story` json NOT NULL,
    `gallery` json NOT NULL,
    `featured_products` json NOT NULL,
    `date` date NOT NULL,
    `impact_participants` varchar(100) NULL,
    `fuel_bars_shared` varchar(100) NULL,
    `vibe_energy` varchar(100) NULL,
    `scheduled_date` date NULL,
    `is_active` bool NOT NULL
);

-- Blog Posts table
CREATE TABLE `api_blogpost` (
    `id` bigint AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `post_type` varchar(20) NOT NULL,
    `title` varchar(255) NOT NULL UNIQUE,
    `excerpt` longtext NOT NULL,
    `image` varchar(100) NULL,
    `date` date NOT NULL,
    `read_time` varchar(20) NOT NULL,
    `author` varchar(100) NOT NULL,
    `content` json NOT NULL,
    `tags` json NOT NULL,
    `scheduled_date` date NULL,
    `is_active` bool NOT NULL,
    `subtitle` varchar(500) NULL,
    `intro_heading` varchar(500) NULL,
    `featured_quote` longtext NULL,
    `author_image` varchar(100) NULL,
    `author_role` varchar(100) NULL,
    `secondary_image` varchar(100) NULL,
    `tertiary_image` varchar(100) NULL,
    `facts_list` json NOT NULL,
    `key_points` json NOT NULL,
    `health_benefits` json NOT NULL,
    `usage_recipes` json NOT NULL,
    `created_at` datetime(6) NULL,
    `updated_at` datetime(6) NULL
);

-- Hero Slides table
CREATE TABLE `api_heroslide` (
    `id` bigint AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `category` varchar(100) NOT NULL,
    `headline` varchar(255) NOT NULL,
    `image` varchar(100) NULL,
    `cta` varchar(50) NOT NULL,
    `cta_link` varchar(255) NULL,
    `secondary_cta` varchar(50) NULL,
    `secondary_cta_link` varchar(255) NULL,
    `bg_color` varchar(50) NOT NULL,
    `accent_color` varchar(50) NOT NULL,
    `blob_color` varchar(50) NOT NULL,
    `product_id` varchar(50) NULL,
    `transition_type` varchar(50) NOT NULL,
    `order` integer NOT NULL,
    `background_image` varchar(100) NULL,
    `mobile_image` varchar(100) NULL,
    `display_duration` integer NOT NULL,
    `is_active` bool NOT NULL
);

-- Orders table
CREATE TABLE `api_order` (
    `id` bigint AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `user_id` integer NULL,
    `user_email` varchar(254) NOT NULL,
    `phone` varchar(20) NOT NULL,
    `first_name` varchar(100) NOT NULL,
    `last_name` varchar(100) NOT NULL,
    `address` longtext NOT NULL,
    `city` varchar(100) NOT NULL,
    `state` varchar(100) NOT NULL,
    `pin_code` varchar(20) NOT NULL,
    `total_amount` numeric(10, 2) NOT NULL,
    `status` varchar(20) NOT NULL,
    `created_at` datetime(6) NOT NULL,
    `razorpay_order_id` varchar(100) NULL,
    `razorpay_payment_id` varchar(100) NULL
);

-- Order Items table
CREATE TABLE `api_orderitem` (
    `id` bigint AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `order_id` bigint NOT NULL,
    `product_id` bigint NULL,
    `product_name` varchar(255) NOT NULL,
    `price` numeric(10, 2) NOT NULL,
    `quantity` integer UNSIGNED NOT NULL
);

-- User Profile table
CREATE TABLE `api_userprofile` (
    `id` bigint AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `user_id` integer NOT NULL UNIQUE,
    `points` integer NOT NULL,
    `tier` varchar(20) NOT NULL,
    `savings` numeric(10, 2) NOT NULL,
    `phone` varchar(15) NULL,
    `address` longtext NULL,
    `city` varchar(100) NULL,
    `state` varchar(100) NULL,
    `pin_code` varchar(20) NULL,
    `birth_date` date NULL
);

-- Reviews table
CREATE TABLE `api_review` (
    `id` bigint AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `product_id` bigint NULL,
    `user_id` integer NULL,
    `product_id_str` varchar(50) NOT NULL,
    `user_name` varchar(255) NOT NULL,
    `user_role` varchar(255) NOT NULL,
    `rating` integer NOT NULL,
    `comment` longtext NOT NULL,
    `date` date NOT NULL,
    `avatar` varchar(1000) NOT NULL
);

-- Stories table
CREATE TABLE `api_story` (
    `id` bigint AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `media_url` varchar(100) NULL,
    `poster_url` varchar(100) NULL,
    `original_drive_url` varchar(1000) NULL,
    `full_video_url` varchar(100) NULL,
    `media_type` varchar(10) NOT NULL,
    `product_id` varchar(50) NOT NULL
);

-- Announcement table
CREATE TABLE `api_announcement` (
    `id` bigint AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `message` longtext NOT NULL,
    `start_date` datetime(6) NOT NULL,
    `end_date` datetime(6) NOT NULL,
    `is_active` bool NOT NULL,
    `created_at` datetime(6) NOT NULL
);

-- Distributor Application table
CREATE TABLE `api_distributorapplication` (
    `id` bigint AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `business_name` varchar(255) NOT NULL,
    `full_name` varchar(255) NOT NULL,
    `phone_number` varchar(20) NOT NULL,
    `city` varchar(100) NULL,
    `email` varchar(254) NOT NULL,
    `status` varchar(20) NOT NULL,
    `created_at` datetime(6) NOT NULL
);

-- Newsletter Subscriber table
CREATE TABLE `api_newslettersubscriber` (
    `id` bigint AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `email` varchar(254) NOT NULL UNIQUE,
    `subscribed_at` datetime(6) NOT NULL,
    `is_active` bool NOT NULL
);

-- Reward Rules table
CREATE TABLE `api_rewardrule` (
    `id` bigint AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `event_name` varchar(50) NOT NULL UNIQUE,
    `points` integer NOT NULL,
    `is_enabled` bool NOT NULL,
    `description` longtext NULL
);

-- Reward Transactions table
CREATE TABLE `api_rewardtransaction` (
    `id` bigint AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `user_id` integer NOT NULL,
    `points_change` integer NOT NULL,
    `reason` varchar(255) NOT NULL,
    `timestamp` datetime(6) NOT NULL
);

-- Usage Idea table
CREATE TABLE `api_usageidea` (
    `id` bigint AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `product_id` bigint NOT NULL,
    `title` varchar(255) NOT NULL,
    `description` longtext NOT NULL,
    `image` varchar(100) NULL,
    `order` integer NOT NULL
);

-- Wishlist Item table
CREATE TABLE `api_wishlistitem` (
    `id` bigint AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `user_id` integer NOT NULL,
    `product_id` bigint NOT NULL,
    `added_at` datetime(6) NOT NULL,
    UNIQUE KEY `api_wishlistitem_user_id_product_id_449208a5_uniq` (`user_id`, `product_id`)
);

-- Wishlist Share Link table
CREATE TABLE `api_wishlistsharelink` (
    `id` bigint AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `user_id` integer NOT NULL,
    `token` varchar(64) NOT NULL UNIQUE,
    `created_at` datetime(6) NOT NULL,
    `expires_at` datetime(6) NOT NULL,
    `is_active` bool NOT NULL
);

-- Password Reset OTP table
CREATE TABLE `api_passwordresetotp` (
    `id` bigint AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `user_id` integer NOT NULL,
    `otp` varchar(6) NOT NULL,
    `created_at` datetime(6) NOT NULL,
    `attempts` integer NOT NULL
);

-- Visitor Form table
CREATE TABLE `api_visitorform` (
    `id` bigint AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `title` varchar(255) NOT NULL,
    `event_name` varchar(255) NOT NULL,
    `status` varchar(20) NOT NULL,
    `created_at` datetime(6) NOT NULL
);

-- Visitor Submission table
CREATE TABLE `api_visitorsubmission` (
    `id` bigint AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `form_id` bigint NOT NULL,
    `name` varchar(100) NOT NULL,
    `email` varchar(254) NOT NULL,
    `phone` varchar(20) NOT NULL,
    `address_details` varchar(255) NOT NULL DEFAULT '',
    `buying_source` varchar(50) NOT NULL DEFAULT '',
    `brand_awareness` bool NOT NULL DEFAULT 0,
    `current_usage` varchar(255) NOT NULL DEFAULT '',
    `flavor_preferences` longtext NOT NULL DEFAULT '',
    `reviewed_product` varchar(100) NOT NULL DEFAULT '',
    `review_content` longtext NOT NULL DEFAULT '',
    `marketing_consent` bool NOT NULL DEFAULT 0,
    `submitted_at` datetime(6) NOT NULL
);

-- Foreign Key Constraints
ALTER TABLE `api_order` ADD CONSTRAINT `api_order_user_id_52781ff0_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);
ALTER TABLE `api_orderitem` ADD CONSTRAINT `api_orderitem_order_id_f9c0afc0_fk_api_order_id` FOREIGN KEY (`order_id`) REFERENCES `api_order` (`id`);
ALTER TABLE `api_orderitem` ADD CONSTRAINT `api_orderitem_product_id_afd9cdd0_fk_api_product_id` FOREIGN KEY (`product_id`) REFERENCES `api_product` (`id`);
ALTER TABLE `api_userprofile` ADD CONSTRAINT `api_userprofile_user_id_5a1c1c92_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);
ALTER TABLE `api_review` ADD CONSTRAINT `api_review_product_id_78d61c8d_fk_api_product_id` FOREIGN KEY (`product_id`) REFERENCES `api_product` (`id`);
ALTER TABLE `api_review` ADD CONSTRAINT `api_review_user_id_8bf97ad4_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);
ALTER TABLE `api_rewardtransaction` ADD CONSTRAINT `api_rewardtransaction_user_id_fce609a3_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);
ALTER TABLE `api_usageidea` ADD CONSTRAINT `api_usageidea_product_id_aab4cc4e_fk_api_product_id` FOREIGN KEY (`product_id`) REFERENCES `api_product` (`id`);
ALTER TABLE `api_wishlistitem` ADD CONSTRAINT `api_wishlistitem_product_id_6a5213b9_fk_api_product_id` FOREIGN KEY (`product_id`) REFERENCES `api_product` (`id`);
ALTER TABLE `api_wishlistitem` ADD CONSTRAINT `api_wishlistitem_user_id_82e712db_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);
ALTER TABLE `api_wishlistsharelink` ADD CONSTRAINT `api_wishlistsharelink_user_id_22b89b35_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);
ALTER TABLE `api_passwordresetotp` ADD CONSTRAINT `api_passwordresetotp_user_id_f36296cf_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);
ALTER TABLE `api_visitorsubmission` ADD CONSTRAINT `api_visitorsubmission_form_id_e3dff749_fk_api_visitorform_id` FOREIGN KEY (`form_id`) REFERENCES `api_visitorform` (`id`);

-- Indexes
CREATE INDEX `api_announcement_is_active_24edec64` ON `api_announcement` (`is_active`);
CREATE INDEX `api_blogpost_is_active_4b36988d` ON `api_blogpost` (`is_active`);
CREATE INDEX `api_event_is_active_ff61b97b` ON `api_event` (`is_active`);
CREATE INDEX `api_heroslide_is_active_9ee158c3` ON `api_heroslide` (`is_active`);
CREATE INDEX `api_newslettersubscriber_is_active_acd67252` ON `api_newslettersubscriber` (`is_active`);
CREATE INDEX `api_order_status_8163a9c4` ON `api_order` (`status`);
CREATE INDEX `api_product_category_cdb50d1a` ON `api_product` (`category`);
CREATE INDEX `api_product_is_top_rated_57905689` ON `api_product` (`is_top_rated`);
CREATE INDEX `api_story_media_type_2045840e` ON `api_story` (`media_type`);
CREATE INDEX `api_story_product_id_bc787981` ON `api_story` (`product_id`);

SET FOREIGN_KEY_CHECKS = 1;

/*
 Target Server Type    : MySQL
 Target Server Version : 50716
 File Encoding         : utf-8

 Date: 12/08/2017 14:33:22 PM
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `rss_items`
-- ----------------------------
DROP TABLE IF EXISTS `rss_items`;
CREATE TABLE `rss_items` (
  `link` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `author` varchar(255) DEFAULT NULL,
  `summary` varchar(255) DEFAULT NULL,
  `origlink` varchar(255) DEFAULT NULL,
  `permalink` varchar(255) DEFAULT NULL,
  `categories` varchar(255) DEFAULT NULL,
  `comments` varchar(255) DEFAULT NULL,
  `enclosures` json DEFAULT NULL,
  `guid` varchar(255) DEFAULT NULL,
  `date` timestamp NULL DEFAULT NULL,
  `pubdate` timestamp NULL DEFAULT NULL,
  `source` json DEFAULT NULL,
  `image` json DEFAULT NULL,
  `hashTags` varchar(255) DEFAULT NULL,
  `shorturl` varchar(255) DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`link`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

SET FOREIGN_KEY_CHECKS = 1;

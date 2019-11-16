CREATE DATABASE  IF NOT EXISTS `company`;
USE `company`;

DROP TABLE IF EXISTS `groups`;
CREATE TABLE `groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `owner_hpid` varchar(256) NOT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `layoutID` int(11) DEFAULT NULL,
  `description` varchar(4000) DEFAULT NULL,
  `metadata` text DEFAULT NULL,
  `name` varchar(256),
  PRIMARY KEY (`id`),
  KEY `layoutID_idx` (`layoutID`) -- ,
  -- CONSTRAINT `LayoutID` FOREIGN KEY (`LayoutID`) REFERENCES `layouts` (`layoutid`),
  -- CONSTRAINT `UserID` FOREIGN KEY (`UserID`) REFERENCES `users` (`userid`)
);

LOCK TABLES `groups` WRITE;
UNLOCK TABLES;

DROP TABLE IF EXISTS `images`;
CREATE TABLE `images` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `uri` varchar(400) DEFAULT NULL,
  `groupID` int(11) NOT NULL,
  `imageIndex` int(11), -- index is reserved
  `metadata` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `groupID_idx` (`groupID`) -- ,
  -- CONSTRAINT `GroupID` FOREIGN KEY (`GroupID`) REFERENCES `groups` (`GroupID`)
);

LOCK TABLES `images` WRITE;
UNLOCK TABLES;

ALTER USER 'root' IDENTIFIED WITH mysql_native_password BY 'atlas';

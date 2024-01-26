-- MySQL dump 10.13  Distrib 8.2.0, for macos13.5 (arm64)
--
-- Host: localhost    Database: quizme
-- ------------------------------------------------------
-- Server version	8.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `card_tags`
--

DROP TABLE IF EXISTS `card_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `card_tags` (
  `card_id` int NOT NULL,
  `tag_id` int NOT NULL,
  PRIMARY KEY (`card_id`,`tag_id`),
  KEY `tag_id` (`tag_id`),
  CONSTRAINT `card_tags_ibfk_1` FOREIGN KEY (`card_id`) REFERENCES `cards` (`card_id`) ON DELETE CASCADE,
  CONSTRAINT `card_tags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`tag_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `card_tags`
--

LOCK TABLES `card_tags` WRITE;
/*!40000 ALTER TABLE `card_tags` DISABLE KEYS */;
/*!40000 ALTER TABLE `card_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cards`
--

DROP TABLE IF EXISTS `cards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cards` (
  `card_id` int NOT NULL AUTO_INCREMENT,
  `deck_id` int DEFAULT NULL,
  `question` text NOT NULL,
  `answer` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`card_id`),
  KEY `deck_id` (`deck_id`),
  CONSTRAINT `cards_ibfk_1` FOREIGN KEY (`deck_id`) REFERENCES `decks` (`deck_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cards`
--

LOCK TABLES `cards` WRITE;
/*!40000 ALTER TABLE `cards` DISABLE KEYS */;
INSERT INTO `cards` VALUES (6,3,'Mass','Measure of the amount of material in a body','2023-12-05 06:25:09'),(7,3,'Weight','Mass x Velocity','2023-12-05 06:25:09'),(8,3,'Density','mass per unit volume','2023-12-05 06:25:09'),(9,4,'Anterior','In-front of','2023-12-05 06:25:18'),(10,5,'Gyri','convolutions','2023-12-05 06:25:44'),(11,5,'Sulci/fissure','depressions','2023-12-05 06:25:44'),(12,5,'cerebrum','two hemispheres each containing the cerebral cortex','2023-12-05 06:25:44'),(14,6,'Algorithm','a list of steps to finish a task, or a pattern','2023-12-05 06:41:25'),(15,6,'Program','A set of algorithms written in a computer language','2023-12-05 06:41:25'),(16,6,'Bug','an error in the program','2023-12-05 06:41:25'),(17,7,'The Romans were polytheistic meaning that they worshipped ___ ?','Many Gods','2023-12-05 06:41:47'),(18,7,'What was ancient Rome\'s population?','Around 1,000,000','2023-12-05 06:41:47'),(19,7,'A peninsula is a piece of land surrounded by _____ ?','water on three sides','2023-12-05 06:41:47'),(21,8,'Diffusion','Passive movement of particles','2023-12-05 09:29:58'),(22,8,'Osmosis','Passive movement of water','2023-12-05 09:29:58'),(23,8,'Active Transport','Movement where energy is required','2023-12-05 09:29:58'),(24,9,'Element','substance that CANNOT be broken down into simpler substances','2023-12-05 09:33:07'),(25,9,'Atom','Smallest part of an element','2023-12-05 09:33:07'),(26,9,'Nucleus','Center of an atom','2023-12-05 09:33:07'),(27,9,'Proton','particle that has a positive charge','2023-12-05 09:33:40'),(28,9,'Electron','particle that has a negative charge','2023-12-05 09:33:40'),(29,9,'Neutron','particle that has a neutral charge','2023-12-05 09:33:40'),(30,6,'Loop','the action of repeating something over and over','2023-12-05 09:40:16'),(31,5,'brainstem','mid brain, pons, medulla oblongata','2023-12-05 09:43:43'),(32,4,'Posterior','In back of','2023-12-05 09:44:45'),(33,4,'Superior','Above','2023-12-05 09:44:45'),(34,4,'Inferior','Below','2023-12-05 09:44:45');
/*!40000 ALTER TABLE `cards` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `deck_tags`
--

DROP TABLE IF EXISTS `deck_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `deck_tags` (
  `deck_id` int NOT NULL,
  `tag_id` int NOT NULL,
  PRIMARY KEY (`deck_id`,`tag_id`),
  KEY `tag_id` (`tag_id`),
  CONSTRAINT `deck_tags_ibfk_1` FOREIGN KEY (`deck_id`) REFERENCES `decks` (`deck_id`) ON DELETE CASCADE,
  CONSTRAINT `deck_tags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`tag_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `deck_tags`
--

LOCK TABLES `deck_tags` WRITE;
/*!40000 ALTER TABLE `deck_tags` DISABLE KEYS */;
/*!40000 ALTER TABLE `deck_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `decks`
--

DROP TABLE IF EXISTS `decks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `decks` (
  `deck_id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(32) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`deck_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `decks_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `decks`
--

LOCK TABLES `decks` WRITE;
/*!40000 ALTER TABLE `decks` DISABLE KEYS */;
INSERT INTO `decks` VALUES (3,'3fb35c0a43f44f04aaa0757b68903f84','Physics','Basics','2023-12-05 06:25:09'),(4,'3fb35c0a43f44f04aaa0757b68903f84','Anatomy','Basics','2023-12-05 06:25:18'),(5,'3fb35c0a43f44f04aaa0757b68903f84','Neuroscience','Basics','2023-12-05 06:25:44'),(6,'91ae3d631828409b86a9a9f79b64763f','Computer Science','Basics','2023-12-05 06:41:25'),(7,'91ae3d631828409b86a9a9f79b64763f','History','Basics','2023-12-05 06:41:47'),(8,'91ae3d631828409b86a9a9f79b64763f','Biology','Basics','2023-12-05 09:29:58'),(9,'91ae3d631828409b86a9a9f79b64763f','Chemistry','Basics','2023-12-05 09:33:07');
/*!40000 ALTER TABLE `decks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favorite_decks`
--

DROP TABLE IF EXISTS `favorite_decks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorite_decks` (
  `user_id` varchar(32) NOT NULL,
  `deck_id` int NOT NULL,
  `creator_id` varchar(32) NOT NULL,
  PRIMARY KEY (`user_id`,`deck_id`,`creator_id`),
  KEY `deck_id` (`deck_id`),
  KEY `creator_id` (`creator_id`),
  CONSTRAINT `favorite_decks_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `favorite_decks_ibfk_2` FOREIGN KEY (`deck_id`) REFERENCES `decks` (`deck_id`) ON DELETE CASCADE,
  CONSTRAINT `favorite_decks_ibfk_3` FOREIGN KEY (`creator_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorite_decks`
--

LOCK TABLES `favorite_decks` WRITE;
/*!40000 ALTER TABLE `favorite_decks` DISABLE KEYS */;
INSERT INTO `favorite_decks` VALUES ('3fb35c0a43f44f04aaa0757b68903f84',4,'3fb35c0a43f44f04aaa0757b68903f84'),('3fb35c0a43f44f04aaa0757b68903f84',5,'3fb35c0a43f44f04aaa0757b68903f84'),('91ae3d631828409b86a9a9f79b64763f',6,'91ae3d631828409b86a9a9f79b64763f'),('91ae3d631828409b86a9a9f79b64763f',7,'91ae3d631828409b86a9a9f79b64763f'),('91ae3d631828409b86a9a9f79b64763f',8,'91ae3d631828409b86a9a9f79b64763f');
/*!40000 ALTER TABLE `favorite_decks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recent_decks`
--

DROP TABLE IF EXISTS `recent_decks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recent_decks` (
  `insertion_order` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(32) DEFAULT NULL,
  `deck_id` int DEFAULT NULL,
  `creator_id` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`insertion_order`),
  KEY `user_id` (`user_id`),
  KEY `deck_id` (`deck_id`),
  KEY `creator_id` (`creator_id`),
  CONSTRAINT `recent_decks_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `recent_decks_ibfk_2` FOREIGN KEY (`deck_id`) REFERENCES `decks` (`deck_id`) ON DELETE CASCADE,
  CONSTRAINT `recent_decks_ibfk_3` FOREIGN KEY (`creator_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=162 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recent_decks`
--

LOCK TABLES `recent_decks` WRITE;
/*!40000 ALTER TABLE `recent_decks` DISABLE KEYS */;
INSERT INTO `recent_decks` VALUES (74,'91ae3d631828409b86a9a9f79b64763f',3,'3fb35c0a43f44f04aaa0757b68903f84'),(97,'3fb35c0a43f44f04aaa0757b68903f84',5,'3fb35c0a43f44f04aaa0757b68903f84'),(99,'3fb35c0a43f44f04aaa0757b68903f84',4,'3fb35c0a43f44f04aaa0757b68903f84'),(102,'3fb35c0a43f44f04aaa0757b68903f84',3,'3fb35c0a43f44f04aaa0757b68903f84'),(103,'3fb35c0a43f44f04aaa0757b68903f84',7,'91ae3d631828409b86a9a9f79b64763f'),(104,'91ae3d631828409b86a9a9f79b64763f',7,'91ae3d631828409b86a9a9f79b64763f'),(107,'91ae3d631828409b86a9a9f79b64763f',8,'91ae3d631828409b86a9a9f79b64763f'),(108,'91ae3d631828409b86a9a9f79b64763f',5,'3fb35c0a43f44f04aaa0757b68903f84'),(157,'91ae3d631828409b86a9a9f79b64763f',6,'91ae3d631828409b86a9a9f79b64763f'),(160,'91ae3d631828409b86a9a9f79b64763f',9,'91ae3d631828409b86a9a9f79b64763f'),(161,'91ae3d631828409b86a9a9f79b64763f',4,'3fb35c0a43f44f04aaa0757b68903f84');
/*!40000 ALTER TABLE `recent_decks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tags`
--

DROP TABLE IF EXISTS `tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tags` (
  `tag_id` int NOT NULL AUTO_INCREMENT,
  `tag_name` varchar(255) NOT NULL,
  PRIMARY KEY (`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tags`
--

LOCK TABLES `tags` WRITE;
/*!40000 ALTER TABLE `tags` DISABLE KEYS */;
/*!40000 ALTER TABLE `tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_progress`
--

DROP TABLE IF EXISTS `user_progress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_progress` (
  `user_id` varchar(32) NOT NULL,
  `deck_id` int NOT NULL,
  `score` int DEFAULT NULL,
  `last_completed` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`,`deck_id`),
  KEY `deck_id` (`deck_id`),
  CONSTRAINT `user_progress_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `user_progress_ibfk_2` FOREIGN KEY (`deck_id`) REFERENCES `decks` (`deck_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_progress`
--

LOCK TABLES `user_progress` WRITE;
/*!40000 ALTER TABLE `user_progress` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_progress` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` varchar(32) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `is_confirmed` tinyint(1) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('3fb35c0a43f44f04aaa0757b68903f84','testuser1','$2b$12$c5m1tb5WxV21l5OMmi0Zr.FJvTDSYSlWvXm4dNJ3mdVV/l7pkGhaW','appvamsi@gmail.com',1),('91ae3d631828409b86a9a9f79b64763f','gorrepativ','$2b$12$8Ptvp0lV38DWOM4jUpQNHeS2Ijiu8esfeDxbsBfnZGP9Snav9DOMq','vamsi.gorrepati@yale.edu',1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-12-05 22:36:12

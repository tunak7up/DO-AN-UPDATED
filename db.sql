-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: websale
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `appointment_histories`
--

DROP TABLE IF EXISTS `appointment_histories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointment_histories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `appointment_id` bigint unsigned NOT NULL,
  `changed_by_user_id` int DEFAULT NULL COMMENT 'ID người thực hiện thay đổi',
  `old_status` varchar(50) DEFAULT NULL,
  `new_status` varchar(50) DEFAULT NULL,
  `old_payment_status` varchar(50) DEFAULT NULL,
  `new_payment_status` varchar(50) DEFAULT NULL,
  `old_technician_id` int DEFAULT NULL,
  `new_technician_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_history_appointment` (`appointment_id`),
  KEY `fk_history_user` (`changed_by_user_id`),
  CONSTRAINT `fk_history_appointment` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_history_appointment_user` FOREIGN KEY (`changed_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointment_histories`
--

LOCK TABLES `appointment_histories` WRITE;
/*!40000 ALTER TABLE `appointment_histories` DISABLE KEYS */;
INSERT INTO `appointment_histories` VALUES (1,3,18,'assigned','assigned','Unpaid','Unpaid',2,5,'2026-04-13 01:05:55'),(2,3,18,'assigned','assigned','Unpaid','Paid',5,5,'2026-04-13 01:06:04'),(3,3,18,'assigned','assigned','Paid','Paid',5,2,'2026-04-13 01:06:11'),(4,3,18,'assigned','in_progress','Paid','Paid',2,2,'2026-04-13 01:06:34'),(5,3,18,'in_progress','in_progress','Paid','Unpaid',2,2,'2026-04-13 01:33:11'),(6,3,18,'in_progress','pending','Unpaid','Unpaid',2,2,'2026-04-13 01:33:23'),(7,3,18,'pending','assigned','Unpaid','Unpaid',2,2,'2026-04-13 01:33:53'),(8,3,18,'assigned','in_progress','Unpaid','Unpaid',2,2,'2026-04-13 01:33:58'),(9,3,18,'in_progress','completed','Unpaid','Unpaid',2,2,'2026-04-13 01:34:02'),(10,3,18,'completed','pending','Unpaid','Unpaid',2,2,'2026-04-13 01:34:07'),(11,3,18,'pending','pending','Unpaid','Paid',2,2,'2026-04-13 01:34:11'),(12,3,18,'pending','pending','Paid','Paid',2,5,'2026-04-13 01:34:17'),(13,3,27,'pending','pending','Paid','Unpaid',5,5,'2026-04-13 01:36:16'),(14,3,28,'pending','pending','Unpaid','Unpaid',5,2,'2026-04-13 01:40:30'),(15,3,28,'pending','pending','Unpaid','Paid',2,2,'2026-04-13 01:40:38'),(16,3,29,'pending','assigned','Paid','Paid',2,2,'2026-04-13 01:41:36'),(17,4,28,'pending','in_progress','Unpaid','Unpaid',NULL,NULL,'2026-04-13 01:49:41'),(18,4,28,'in_progress','in_progress','Unpaid','Unpaid',NULL,5,'2026-04-13 01:49:47'),(19,4,27,'in_progress','in_progress','Unpaid','Paid',5,5,'2026-04-13 12:54:15'),(20,3,27,'assigned','assigned','Paid','Unpaid',2,2,'2026-04-13 12:54:20'),(21,4,29,'in_progress','in_progress','Paid','Paid',5,2,'2026-04-13 12:54:51'),(22,4,27,'in_progress','in_progress','Paid','Unpaid',2,2,'2026-04-13 14:54:23'),(23,4,29,'in_progress','assigned','Unpaid','Unpaid',2,5,'2026-04-13 14:55:28'),(24,5,18,'pending','assigned','Unpaid','Paid',NULL,5,'2026-06-29 16:53:20'),(25,5,29,'assigned','in_progress','Paid','Paid',5,5,'2026-06-29 16:53:52'),(26,5,27,'in_progress','in_progress','Paid','Unpaid',5,5,'2026-06-29 16:54:00'),(27,5,27,'in_progress','in_progress','Unpaid','Paid',5,5,'2026-06-29 16:54:03');
/*!40000 ALTER TABLE `appointment_histories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `appointments`
--

DROP TABLE IF EXISTS `appointments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `service_id` int NOT NULL,
  `technician_id` int DEFAULT NULL,
  `store_id` int DEFAULT NULL,
  `appointment_time` timestamp NOT NULL,
  `price_at_booking` decimal(10,2) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'pending',
  `note` text,
  `payment_status` varchar(50) NOT NULL DEFAULT 'Unpaid',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointments`
--

LOCK TABLES `appointments` WRITE;
/*!40000 ALTER TABLE `appointments` DISABLE KEYS */;
INSERT INTO `appointments` VALUES (1,16,1,NULL,NULL,'2026-04-08 18:03:00',3000000.00,'pending',NULL,'Unpaid'),(2,16,1,5,1,'2026-04-08 18:03:00',3000000.00,'assigned',NULL,'Unpaid'),(3,16,1,2,1,'2026-04-03 09:16:00',3000000.00,'assigned',NULL,'Unpaid'),(4,32,3,5,1,'2026-04-24 18:49:00',1000000.00,'assigned','Màn xanh lè ','Unpaid'),(5,32,3,5,1,'2026-06-05 09:52:00',1000000.00,'in_progress',NULL,'Paid');
/*!40000 ALTER TABLE `appointments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (1,1,'2025-12-01 15:31:39'),(2,16,'2025-12-23 15:47:41'),(3,17,'2025-12-24 09:31:00'),(4,18,'2025-12-30 12:36:54'),(5,19,'2026-01-16 08:10:27'),(6,20,'2026-01-16 10:10:11'),(7,26,'2026-04-12 18:15:19'),(8,27,'2026-04-12 18:35:50'),(9,28,'2026-04-12 18:40:01'),(10,29,'2026-04-12 18:41:25'),(11,30,'2026-04-12 18:42:45'),(12,31,'2026-04-12 18:43:53'),(13,32,'2026-04-12 18:49:04'),(14,33,'2026-04-13 05:49:45'),(15,37,'2026-05-02 16:44:34');
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_item`
--

DROP TABLE IF EXISTS `cart_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_item` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cart_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `quantity` int DEFAULT '1',
  `price_at_add` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cart_id` (`cart_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `cart_item_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cart_item_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_item`
--

LOCK TABLES `cart_item` WRITE;
/*!40000 ALTER TABLE `cart_item` DISABLE KEYS */;
INSERT INTO `cart_item` VALUES (36,5,22,1,32000000),(74,13,2,1,25000000);
/*!40000 ALTER TABLE `cart_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'Laptop','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-BsOPDrRzqWhEGz_PXaeLjV25bUiGFyxL0g&s'),(2,'PC Gaming','https://pcmarket.vn/media/product/12002_pc_5090.jpg'),(3,'Linh kiện máy tính','https://product.hstatic.net/200000860097/product/1024__4__f656c63b34d042ceb797184cef3f9628.png'),(4,'Màn hình','https://cdn.tgdd.vn//News/1499650//man-hinh-may-tinh-5-800x450-1.jpg'),(5,'Bàn phím','https://www.kiiboom.com/cdn/shop/files/1_3e0cca45-914f-4d30-aeb6-0e81c5546cbb.png?v=1718680995&width=1946'),(6,'Chuột',NULL),(7,'Tai nghe',NULL),(8,'Loa',NULL),(9,'Thiết bị mạng',NULL),(10,'Phụ kiện khác',NULL);
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedback`
--

DROP TABLE IF EXISTS `feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedback` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int DEFAULT NULL,
  `rating` int DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `feedback_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedback`
--

LOCK TABLES `feedback` WRITE;
/*!40000 ALTER TABLE `feedback` DISABLE KEYS */;
/*!40000 ALTER TABLE `feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gallery`
--

DROP TABLE IF EXISTS `gallery`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gallery` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int DEFAULT NULL,
  `thumbnail` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `gallery_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gallery`
--

LOCK TABLES `gallery` WRITE;
/*!40000 ALTER TABLE `gallery` DISABLE KEYS */;
/*!40000 ALTER TABLE `gallery` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `import_receipt`
--

DROP TABLE IF EXISTS `import_receipt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `import_receipt` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_by` int DEFAULT NULL,
  `supplier_name` varchar(255) DEFAULT NULL,
  `total_amount` decimal(15,2) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `note` varchar(255) DEFAULT NULL,
  `store_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `import_receipt_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `import_receipt`
--

LOCK TABLES `import_receipt` WRITE;
/*!40000 ALTER TABLE `import_receipt` DISABLE KEYS */;
INSERT INTO `import_receipt` VALUES (3,33,'Công ty TNHH Biotechnica',30200000.00,'2026-05-02 18:56:51','nhap moi',1),(4,18,'Công ty TNHH Biotechnica',100000000.00,'2026-05-02 19:00:10','',2),(5,18,'Công ty TNHH Biotechnica',30000000.00,'2026-05-02 19:00:37','',1),(6,33,'Công ty TNHH Biotechnica',26500000.00,'2026-05-03 00:42:06','Hang moi ve',2),(7,33,'Công ty TNHH Biotechnica',40000000.00,'2026-05-03 00:45:25','',1),(8,33,'Công ty TNHH Biotechnica',30000000.00,'2026-05-03 00:45:37','',1),(9,18,'Khách vãng lai',30200000.00,'2026-05-03 00:46:01','',2),(10,18,'Công ty TNHH Biotechnica',6700000.00,'2026-05-03 00:46:42','',2),(11,18,'Công ty TNHH Biotechnica',1500000.00,'2026-05-03 00:47:06','',3),(12,33,'Công ty TNHH Biotechnica',25000000.00,'2026-05-04 14:37:59','',1),(13,33,'Công ty TNHH Biotechnica',25000000.00,'2026-05-04 14:38:18','',1),(14,33,'Công ty TNHH Biotechnica',16000000.00,'2026-05-04 14:47:18','',1),(15,18,'Đại học BKHN',125000000.00,'2026-06-29 21:59:28','',1),(16,18,'Đại học BKHN',28200000.00,'2026-06-29 22:57:47','',1),(17,18,'Khách vãng lai',300000000.00,'2026-06-29 23:12:54','',1);
/*!40000 ALTER TABLE `import_receipt` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `import_receipt_detail`
--

DROP TABLE IF EXISTS `import_receipt_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `import_receipt_detail` (
  `id` int NOT NULL AUTO_INCREMENT,
  `receipt_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `unit_price` decimal(15,2) DEFAULT NULL,
  `total_price` decimal(15,2) DEFAULT NULL,
  `store_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `receipt_id` (`receipt_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `import_receipt_detail_ibfk_1` FOREIGN KEY (`receipt_id`) REFERENCES `import_receipt` (`id`),
  CONSTRAINT `import_receipt_detail_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `import_receipt_detail`
--

LOCK TABLES `import_receipt_detail` WRITE;
/*!40000 ALTER TABLE `import_receipt_detail` DISABLE KEYS */;
INSERT INTO `import_receipt_detail` VALUES (1,3,2,1,29000000.00,29000000.00,1),(2,3,3,1,1200000.00,1200000.00,1),(3,4,2,1,25000000.00,25000000.00,2),(4,4,1,5,15000000.00,75000000.00,2),(5,5,1,2,15000000.00,30000000.00,1),(6,6,2,1,25000000.00,25000000.00,2),(7,6,5,1,1500000.00,1500000.00,2),(8,7,2,1,25000000.00,25000000.00,1),(9,7,1,1,15000000.00,15000000.00,1),(10,8,1,2,15000000.00,30000000.00,1),(11,9,2,1,25000000.00,25000000.00,2),(12,9,4,1,5200000.00,5200000.00,2),(13,10,5,1,1500000.00,1500000.00,2),(14,10,4,1,5200000.00,5200000.00,2),(15,11,5,1,1500000.00,1500000.00,3),(16,12,2,1,25000000.00,25000000.00,1),(17,13,2,1,25000000.00,25000000.00,1),(18,14,1,1,16000000.00,16000000.00,1),(19,15,2,5,25000000.00,125000000.00,1),(20,16,2,1,27000000.00,27000000.00,1),(21,16,3,1,1200000.00,1200000.00,1),(22,17,27,5,60000000.00,300000000.00,1);
/*!40000 ALTER TABLE `import_receipt_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory`
--

DROP TABLE IF EXISTS `inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int DEFAULT NULL,
  `store_id` int DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_product_store` (`product_id`,`store_id`),
  KEY `store_id` (`store_id`),
  CONSTRAINT `inventory_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `inventory_ibfk_2` FOREIGN KEY (`store_id`) REFERENCES `store` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory`
--

LOCK TABLES `inventory` WRITE;
/*!40000 ALTER TABLE `inventory` DISABLE KEYS */;
INSERT INTO `inventory` VALUES (1,1,1,23),(2,1,2,21),(3,1,3,11),(4,2,1,18),(5,2,2,11),(6,3,3,20),(7,4,1,0),(8,5,2,12),(9,6,3,12),(10,7,1,23),(11,8,2,21),(12,9,3,11),(13,10,1,13),(14,11,1,6),(15,11,2,1),(16,11,3,5),(17,2,3,0),(18,5,1,2),(19,5,3,1),(20,12,1,2),(21,12,2,2),(22,12,3,3),(23,13,1,0),(24,13,2,0),(25,13,3,0),(26,14,1,0),(27,14,2,0),(28,14,3,0),(29,7,2,0),(30,7,3,5),(31,6,1,4),(32,6,2,2),(33,15,1,1),(34,15,2,1),(35,15,3,1),(36,16,1,1),(37,16,2,1),(38,16,3,0),(39,10,2,1),(40,10,3,0),(41,4,2,0),(42,17,1,1),(43,17,2,2),(44,17,3,3),(45,18,1,1),(46,18,2,3),(47,18,3,3),(48,19,1,1),(49,19,2,1),(50,19,3,0),(51,20,1,1),(52,20,2,2),(53,20,3,3),(54,21,1,1),(55,21,2,2),(56,21,3,3),(57,22,1,3),(58,22,2,1),(59,22,3,0),(60,23,1,2),(61,23,2,0),(62,23,3,10),(63,24,1,2),(64,24,2,7),(65,24,3,8),(66,3,1,2),(67,25,1,1),(68,25,2,2),(69,25,3,3),(70,26,1,1),(71,26,2,0),(72,26,3,0),(73,27,1,5),(74,27,2,2);
/*!40000 ALTER TABLE `inventory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_histories`
--

DROP TABLE IF EXISTS `order_histories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_histories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `changed_by_user_id` int DEFAULT NULL COMMENT 'ID của admin hoặc user thực hiện thay đổi',
  `old_status` varchar(50) DEFAULT NULL,
  `new_status` varchar(50) NOT NULL,
  `old_payment_status` varchar(50) DEFAULT NULL,
  `new_payment_status` varchar(50) DEFAULT NULL,
  `old_shipper_id` int DEFAULT NULL,
  `new_shipper_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `note` text,
  PRIMARY KEY (`id`),
  KEY `fk_history_order` (`order_id`),
  KEY `fk_history_user` (`changed_by_user_id`),
  CONSTRAINT `fk_history_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_history_user` FOREIGN KEY (`changed_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=106 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_histories`
--

LOCK TABLES `order_histories` WRITE;
/*!40000 ALTER TABLE `order_histories` DISABLE KEYS */;
INSERT INTO `order_histories` VALUES (1,18,18,'Completed','Processing','Paid','Paid',NULL,NULL,'2026-04-13 01:05:41',NULL),(2,18,18,'Processing','Processing','Paid','Unpaid',NULL,NULL,'2026-04-13 01:32:51',NULL),(3,16,18,'Completed','Completed','Paid','Unpaid',NULL,NULL,'2026-04-13 01:34:33',NULL),(4,18,18,'Processing','Shipping','Unpaid','Unpaid',NULL,NULL,'2026-04-13 01:34:38',NULL),(5,17,18,'Processing','Shipping','Unpaid','Unpaid',NULL,NULL,'2026-04-13 01:34:45',NULL),(6,18,27,'Shipping','Shipping','Unpaid','Paid',NULL,NULL,'2026-04-13 01:36:02',NULL),(7,18,27,'Shipping','Shipping','Paid','Unpaid',NULL,NULL,'2026-04-13 01:36:07',NULL),(8,18,28,'Shipping','Pending','Unpaid','Paid',NULL,NULL,'2026-04-13 01:40:11',NULL),(9,18,28,'Pending','Pending','Paid','Unpaid',NULL,NULL,'2026-04-13 01:40:22',NULL),(10,18,31,'Pending','Processing','Unpaid','Unpaid',NULL,NULL,'2026-04-13 01:44:06',NULL),(11,11,31,'Pending','Pending','Paid','Unpaid',NULL,NULL,'2026-04-13 01:44:12',NULL),(12,19,31,'Pending','Processing','Unpaid','Unpaid',NULL,NULL,'2026-04-13 01:48:30',NULL),(13,19,31,'Processing','Processing','Unpaid','Paid',NULL,NULL,'2026-04-13 01:48:36',NULL),(14,19,18,'Processing','Processing','Paid','Unpaid',NULL,NULL,'2026-04-13 12:47:43',NULL),(15,19,27,'Processing','Processing','Unpaid','Paid',NULL,NULL,'2026-04-13 12:54:07',NULL),(16,19,28,'Processing','Shipping','Paid','Paid',NULL,NULL,'2026-04-13 12:56:02',NULL),(17,19,31,'Shipping','Completed','Paid','Paid',NULL,NULL,'2026-04-13 12:56:41',NULL),(18,19,27,'Completed','Completed','Paid','Unpaid',NULL,NULL,'2026-04-13 14:54:05',NULL),(19,22,18,'Pending','Processing','Unpaid','Unpaid',NULL,NULL,'2026-05-02 18:11:01',NULL),(20,22,18,'Processing','Shipping','Unpaid','Unpaid',NULL,NULL,'2026-05-02 18:11:07',NULL),(21,22,18,'Shipping','Shipping','Unpaid','Paid',NULL,NULL,'2026-05-02 18:11:13',NULL),(22,23,28,'Pending','Pending','Unpaid','Paid',NULL,NULL,'2026-05-02 18:12:35',NULL),(23,24,28,'Pending','Pending','Unpaid','Paid',NULL,NULL,'2026-05-02 23:52:28',NULL),(24,24,28,'Pending','Processing','Paid','Paid',NULL,NULL,'2026-05-02 23:52:33',NULL),(25,24,28,'Processing','Processing','Paid','Paid',6,16,'2026-05-03 00:04:44',NULL),(26,24,28,'Processing','Processing','Paid','Paid',16,37,'2026-05-03 00:04:49',NULL),(27,24,28,'Processing','Processing','Paid','Unpaid',NULL,NULL,'2026-05-03 00:04:56',NULL),(28,24,28,'Processing','Processing','Unpaid','Paid',NULL,NULL,'2026-05-03 00:05:01',NULL),(29,23,28,'Pending','Pending','Paid','Paid',NULL,37,'2026-05-03 00:05:27',NULL),(30,20,18,'Pending','Processing','Unpaid','Unpaid',NULL,NULL,'2026-05-03 00:11:03',NULL),(31,20,18,'Processing','Processing','Unpaid','Unpaid',NULL,37,'2026-05-03 00:11:03',NULL),(32,11,18,'Pending','Processing','Unpaid','Unpaid',NULL,NULL,'2026-05-03 00:11:13',NULL),(33,11,18,'Processing','Processing','Unpaid','Unpaid',NULL,37,'2026-05-03 00:11:13',NULL),(34,5,18,'Pending','Pending','Unpaid','Unpaid',NULL,37,'2026-05-03 00:11:18',NULL),(35,25,32,'Pending','Cancelled','Unpaid','Unpaid',NULL,NULL,'2026-05-03 00:20:11',NULL),(36,26,18,'Pending','Processing','Unpaid','Unpaid',NULL,NULL,'2026-05-03 00:21:27',NULL),(37,26,28,'Processing','Pending','Unpaid','Unpaid',NULL,NULL,'2026-05-03 00:36:50',NULL),(38,26,28,'Pending','Pending','Unpaid','Unpaid',NULL,37,'2026-05-03 00:36:50',NULL),(39,25,28,'Cancelled','Pending','Unpaid','Paid',NULL,NULL,'2026-05-03 00:37:01',NULL),(40,25,28,'Pending','Pending','Paid','Paid',NULL,37,'2026-05-03 00:37:02',NULL),(41,26,28,'Pending','Processing','Unpaid','Unpaid',NULL,NULL,'2026-05-03 00:37:15',NULL),(42,27,18,'Pending','Processing','Unpaid','Paid',NULL,NULL,'2026-05-03 00:39:45',NULL),(43,27,18,'Processing','Processing','Paid','Paid',NULL,37,'2026-05-03 00:39:45',NULL),(44,27,18,'Processing','Shipping','Paid','Paid',NULL,NULL,'2026-05-03 00:39:59',NULL),(45,27,18,'Shipping','Processing','Paid','Paid',NULL,NULL,'2026-05-03 00:40:04',NULL),(46,25,32,'Pending','Cancelled','Paid','Paid',37,37,'2026-05-03 00:41:12',NULL),(47,27,28,'Completed','Completed','Paid','Paid',37,6,'2026-05-04 14:33:26',NULL),(48,28,28,'Pending','Processing','Unpaid','Unpaid',NULL,NULL,'2026-05-04 14:35:39',NULL),(49,30,28,'Pending','Pending','Unpaid','Unpaid',NULL,37,'2026-05-04 14:43:24',NULL),(50,29,28,'Pending','Processing','Unpaid','Unpaid',NULL,NULL,'2026-05-04 14:43:32',NULL),(51,29,28,'Processing','Processing','Unpaid','Unpaid',NULL,37,'2026-05-04 14:43:32',NULL),(52,32,32,'Pending','Cancelled','Unpaid','Unpaid',NULL,NULL,'2026-05-04 14:46:31',NULL),(53,33,18,'Pending','Processing','Unpaid','Paid',NULL,NULL,'2026-05-18 00:52:25',NULL),(54,33,18,'Processing','Processing','Paid','Paid',NULL,6,'2026-05-18 00:52:25',NULL),(55,33,18,'Processing','Processing','Paid','Paid',6,16,'2026-05-18 12:29:28',NULL),(56,35,27,'Pending','Pending','Unpaid','Paid',NULL,NULL,'2026-05-31 23:39:18',NULL),(57,35,28,'Pending','Shipping','Paid','Paid',NULL,NULL,'2026-05-31 23:39:36',NULL),(58,35,28,'Shipping','Shipping','Paid','Paid',NULL,37,'2026-05-31 23:39:36',NULL),(59,35,28,'Shipping','Shipping','Paid','Unpaid',NULL,NULL,'2026-05-31 23:40:55',NULL),(60,36,31,'Pending','Pending','Unpaid','Unpaid',NULL,37,'2026-05-31 23:44:16',NULL),(61,36,18,'Pending','Processing','Unpaid','Unpaid',NULL,NULL,'2026-05-31 23:44:41',NULL),(62,36,18,'Completed','Completed','Unpaid','Paid',NULL,NULL,'2026-05-31 23:46:11',NULL),(63,37,18,'Pending','Processing','Unpaid','Unpaid',NULL,NULL,'2026-06-15 00:42:35',NULL),(64,37,18,'Processing','Processing','Unpaid','Unpaid',NULL,37,'2026-06-15 00:42:35',NULL),(65,40,18,'Pending','Pending','Unpaid','Unpaid',NULL,37,'2026-06-28 01:45:53',NULL),(66,40,18,'Pending','Processing','Unpaid','Unpaid',NULL,NULL,'2026-06-28 01:46:33',NULL),(67,43,18,'Pending','Processing','Unpaid','Unpaid',NULL,NULL,'2026-06-29 16:02:21',NULL),(68,43,18,'Processing','Processing','Unpaid','Unpaid',NULL,37,'2026-06-29 16:03:03',NULL),(69,43,18,'Processing','Shipping','Unpaid','Unpaid',NULL,NULL,'2026-06-29 16:04:35',NULL),(70,44,18,'Pending','Pending','Unpaid','Unpaid',NULL,37,'2026-06-29 16:25:23','[assigned] Gán đơn hàng cho shipper ID: 37 bởi Admin/Manager ID: 18'),(71,44,18,'Pending','Processing','Unpaid','Unpaid',NULL,NULL,'2026-06-29 16:26:53',NULL),(72,44,18,'Processing','Shipping','Unpaid','Unpaid',NULL,NULL,'2026-06-29 16:27:17',NULL),(73,44,18,'Shipping','Completed','Unpaid','Unpaid',NULL,NULL,'2026-06-29 16:27:24',NULL),(74,44,18,'Completed','Completed','Unpaid','Paid',NULL,NULL,'2026-06-29 16:27:33',NULL),(75,44,18,'Completed','Completed','Paid','Paid',37,17,'2026-06-29 16:27:53','[assigned] Gán đơn hàng cho shipper ID: 17 bởi Admin/Manager ID: 18'),(76,44,18,'Completed','Completed','Paid','Paid',17,16,'2026-06-29 16:30:25',NULL),(77,44,18,'Completed','Completed','Paid','Paid',16,37,'2026-06-29 16:30:34',NULL),(78,46,18,'Pending','Processing','Unpaid','Unpaid',NULL,NULL,'2026-06-29 16:33:00',NULL),(79,46,18,'Processing','Processing','Unpaid','Unpaid',NULL,37,'2026-06-29 16:33:00',NULL),(80,46,18,'Processing','Processing','Unpaid','Paid',NULL,NULL,'2026-06-29 16:33:12',NULL),(81,46,18,'Processing','Processing','Paid','Paid',37,37,'2026-06-29 16:33:12',NULL),(82,46,37,'Processing','Shipping','Paid','Paid',NULL,NULL,'2026-06-29 16:33:32','[picked_up] Đã lấy hàng từ kho'),(83,46,37,'Shipping','Cancelled','Paid','Paid',NULL,NULL,'2026-06-29 16:33:44','[failed] Khách không nhận hàng'),(84,47,18,'Pending','Pending','Unpaid','Unpaid',NULL,37,'2026-06-29 16:42:18',NULL),(85,47,18,'Pending','Processing','Unpaid','Unpaid',NULL,NULL,'2026-06-29 16:42:23',NULL),(86,47,18,'Processing','Processing','Unpaid','Unpaid',37,37,'2026-06-29 16:42:23',NULL),(87,47,37,'Processing','Shipping','Unpaid','Unpaid',NULL,NULL,'2026-06-29 16:42:48','[picked_up] Đã lấy hàng'),(88,47,37,'Shipping','Completed','Unpaid','Paid',NULL,NULL,'2026-06-29 16:43:00','[delivered] Đã gửi hàng cho khách'),(89,49,18,'Pending','Pending','Unpaid','Unpaid',NULL,37,'2026-06-29 16:48:05',NULL),(90,49,18,'Pending','Processing','Unpaid','Unpaid',NULL,NULL,'2026-06-29 16:48:21',NULL),(91,49,37,'Processing','Shipping','Unpaid','Unpaid',NULL,NULL,'2026-06-29 16:48:35','[picked_up] Đã lấy hàng từ kho'),(92,49,37,'Shipping','Completed','Unpaid','Paid',NULL,NULL,'2026-06-29 16:48:38','[delivered] Giao hàng thành công'),(93,50,18,'Pending','Processing','Unpaid','Unpaid',NULL,NULL,'2026-06-29 17:21:29',NULL),(94,50,18,'Processing','Processing','Unpaid','Unpaid',NULL,37,'2026-06-29 17:21:32',NULL),(95,50,37,'Processing','Shipping','Unpaid','Unpaid',NULL,NULL,'2026-06-29 17:21:50','[picked_up] Đã lấy hàng từ kho'),(96,50,37,'Shipping','Completed','Unpaid','Paid',NULL,NULL,'2026-06-29 17:21:55','[delivered] Giao hàng thành công'),(97,54,18,'Pending','Processing','Unpaid','Unpaid',NULL,NULL,'2026-06-29 22:49:05',NULL),(98,54,18,'Processing','Processing','Unpaid','Unpaid',NULL,37,'2026-06-29 22:49:05',NULL),(99,53,18,'Pending','Processing','Unpaid','Unpaid',NULL,NULL,'2026-06-29 22:49:13',NULL),(100,53,18,'Processing','Processing','Unpaid','Unpaid',NULL,37,'2026-06-29 22:49:13',NULL),(101,54,37,'Processing','Shipping','Unpaid','Unpaid',NULL,NULL,'2026-06-29 22:49:36','[picked_up] Đã lấy hàng từ kho'),(102,53,37,'Processing','Shipping','Unpaid','Unpaid',NULL,NULL,'2026-06-29 22:49:43','[picked_up] Đã lấy hàng từ kho'),(103,54,37,'Shipping','Completed','Unpaid','Unpaid',NULL,NULL,'2026-06-29 22:50:01','[delivered] Khách không nhận hàng'),(104,53,37,'Shipping','Completed','Unpaid','Paid',NULL,NULL,'2026-06-29 22:50:06','[delivered] Giao hàng thành công'),(105,52,32,'Pending','Cancelled','Unpaid','Unpaid',NULL,NULL,'2026-06-30 00:19:42',NULL);
/*!40000 ALTER TABLE `order_histories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `price_at_order` double NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_order_items_order` (`order_id`),
  KEY `fk_order_items_product` (`product_id`),
  CONSTRAINT `fk_order_items_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_order_items_product` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=82 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,1,1,2,16200000),(2,1,2,4,12500000),(3,1,3,3,1140000),(4,2,11,1,207000000),(5,3,11,1,207000000),(6,3,6,1,736000),(7,4,2,2,12500000),(8,4,12,2,90000),(9,5,1,1,16200000),(10,6,1,1,16200000),(11,6,2,2,12500000),(12,7,2,3,12500000),(13,7,5,4,1350000),(14,8,2,1,12500000),(15,8,12,3,90000),(16,9,2,2,12500000),(17,9,9,2,1710000),(18,9,12,2,90000),(19,10,1,3,14400000),(20,10,2,1,12500000),(21,11,2,1,12500000),(22,11,16,2,8000000),(23,12,1,3,14400000),(24,12,2,2,12500000),(25,13,4,1,4836000),(26,14,1,1,14400000),(27,15,2,1,12500000),(28,15,8,3,902500),(29,16,1,2,14400000),(30,16,17,3,6646.2),(31,17,2,3,12500000),(32,18,2,3,12500000),(33,19,24,2,22400000),(34,20,24,1,22400000),(35,20,21,3,21591000),(36,21,1,1,13500000),(37,22,1,1,13500000),(38,22,22,2,19200000),(39,23,5,3,1350000),(40,23,8,1,902500),(41,24,2,1,12500000),(42,24,6,1,736000),(43,25,1,1,13500000),(44,25,2,2,12500000),(45,26,1,1,13500000),(46,26,3,1,1140000),(47,27,2,1,12500000),(48,27,5,2,1350000),(49,27,6,1,736000),(50,28,1,1,13500000),(51,28,19,2,23008863.36),(52,29,2,2,12500000),(53,30,1,1,13500000),(54,30,4,1,4836000),(55,31,1,1,13500000),(56,31,4,1,4836000),(57,32,1,1,13500000),(58,33,2,1,12500000),(59,34,1,1,13500000),(60,35,1,1,13500000),(61,36,22,1,19200000),(62,37,4,1,4836000),(63,38,17,1,6646.2),(64,39,2,1,12500000),(65,40,1,1,13500000),(66,40,2,1,12500000),(67,41,22,1,19200000),(68,42,2,1,12500000),(69,43,1,2,13500000),(70,44,1,1,13500000),(71,45,2,2,12500000),(72,46,22,2,19200000),(73,47,1,1,13500000),(74,48,1,1,13500000),(75,49,1,1,13500000),(76,50,2,1,12500000),(77,51,22,1,19200000),(78,52,2,1,12500000),(79,53,24,1,22400000),(80,54,2,2,12500000),(81,54,5,3,1350000);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `order_date` datetime NOT NULL,
  `total_amount` double NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'Pending',
  `shipping_address` text NOT NULL,
  `shipping_city` varchar(100) NOT NULL,
  `shipping_district` varchar(100) NOT NULL,
  `shipping_phone` varchar(20) NOT NULL,
  `receiver_name` varchar(255) NOT NULL,
  `payment_method` varchar(50) NOT NULL,
  `payment_status` varchar(50) NOT NULL DEFAULT 'Unpaid',
  `notes` text,
  `shipper_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_orders_user` (`user_id`),
  KEY `shipper_id` (`shipper_id`),
  CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`shipper_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,1,'2025-12-01 23:20:10',85850000,'Pending','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','hcm','q1','adf','asdf','cod','Unpaid','',NULL),(2,1,'2025-12-02 19:57:03',207030000,'Pending','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','hcm','q1','0901234567','asdf','cod','Unpaid','',NULL),(3,1,'2025-12-02 20:49:17',207766000,'Pending','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','hcm','q2','456','asdf','cod','Unpaid','',NULL),(4,1,'2025-12-03 16:35:14',25210000,'Shipping','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','hn','q1','10123','tuan','cod','Paid','note',NULL),(5,1,'2025-12-23 22:28:57',16230000,'Pending','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','hcm','q1','0901234567','asdf','bank','Unpaid','',37),(6,16,'2025-12-23 22:48:38',41230000,'Completed','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','hcm','q1','0901234567','Tuấn','momo','Paid','',NULL),(7,16,'2025-12-23 23:09:34',42930000,'Completed','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','hcm','q1','0901234567','Tuấn','bank','Paid','dsasad',NULL),(8,17,'2025-12-24 16:32:30',12800000,'Processing','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','hcm','q1','0901234567','Tuấn ','momo','Paid','24 thang 12 ',NULL),(9,16,'2025-12-30 19:35:36',28630000,'Cancelled','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','hcm','q1','0901234567','Tuấn','bank','Paid','',NULL),(10,16,'2026-01-01 15:42:52',55730000,'Pending','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','hn','q2','0987962495','tuan','cod','Unpaid','',NULL),(11,16,'2026-01-01 15:44:16',28530000,'Completed','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','hn','q1','0987962495','tuan','cod','Paid','',37),(12,16,'2026-01-10 14:27:25',68230000,'Shipping','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','hn','q1','0987962495','tuan','cod','Paid','',NULL),(13,16,'2026-01-10 14:42:00',4866000,'Completed','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','hn','q1','0987962495','tuan','cod','Paid','',NULL),(14,16,'2026-01-13 20:31:18',14430000,'Completed','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','hn','q1','0987962495','tuan','cod','Paid','',NULL),(15,16,'2026-01-13 20:33:48',15237500,'Completed','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','hn','q1','0987962495','tuan','momo','Unpaid','',NULL),(16,16,'2026-01-13 20:39:52',28849938.6,'Completed','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','hn','q1','0987962495','tuan','momo','Unpaid','',NULL),(17,20,'2026-01-16 17:11:41',37530000,'Shipping','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','hn','q2','0987962495','tuan','cod','Unpaid','alala',NULL),(18,16,'2026-03-29 21:43:02',37530000,'Processing','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','hcm','q2','0901234567','asdf','cod','Unpaid','',NULL),(19,31,'2026-04-13 01:48:14',44830000,'Completed','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','hcm','q1','0901234567','Tuấn','cod','Unpaid','Ha noi',NULL),(20,34,'2026-05-02 18:06:15',87173000,'Completed','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','hn','q1','0987962495','Khách vãng lai','cash','Unpaid','Don truc tiep',37),(21,34,'2026-05-02 18:09:18',13500000,'Completed','Mua tại cửa hàng','N/A','N/A','0123456789','Test','cash','Unpaid','',37),(22,34,'2026-05-02 18:10:54',51900000,'Shipping','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','hn','q1','0987962495','Khách vãng lai','cash','Paid','truc tiep',NULL),(23,34,'2026-05-02 18:11:59',4952500,'Completed','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','hcm','q2','0901234567','Khách lẻ','bank_transfer','Paid','blabla',37),(24,34,'2026-05-02 18:14:05',13236000,'Cancelled','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','hcm','q1','0901234567','Khách lẻ from dr','bank_transfer','Paid','fdg',37),(25,32,'2026-05-03 00:14:18',38530000,'Cancelled','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','hcm','q1','0901234567','Tuấn','cod','Paid','',37),(26,32,'2026-05-03 00:21:11',14670000,'Cancelled','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','hn','q1','0987962495','tuan','cod','Unpaid','',37),(27,34,'2026-05-03 00:39:33',15936000,'Completed','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','hcm','q1','0901234567','Khách lẻ from dr','cash','Paid','',6),(28,32,'2026-05-04 14:34:53',59547726.72,'Processing','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','hcm','q1','0901234567','Tuấn','cod','Unpaid','',NULL),(29,32,'2026-05-04 14:35:22',25030000,'Completed','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','hcm','q1','0901234567','Tuấn','cod','Paid','',37),(30,34,'2026-05-04 14:39:04',18336000,'Pending','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','hcm','q1','0901234567','Khách lẻ','cash','Unpaid','',37),(31,34,'2026-05-04 14:45:10',18336000,'Pending','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','hcm','q2','0901234567','Khách lẻ','cash','Unpaid','',NULL),(32,32,'2026-05-04 14:46:06',13530000,'Cancelled','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','hcm','q1','0901234567','Tuấn','cod','Unpaid','',NULL),(33,32,'2026-05-18 00:46:54',12530000,'Processing','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','hcm','q1','0901234567','Tuấn','cod','Paid','Không nhận ship chiều',16),(34,32,'2026-05-31 22:09:20',13530000,'Pending','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','hn','q2','0987962495','tuan','cod','Unpaid','',NULL),(35,32,'2026-05-31 23:39:00',13530000,'Completed','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','hcm','q1','0901234567','Tuấn','cod','Paid','',37),(36,32,'2026-05-31 23:43:58',19230000,'Completed','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','hcm','q1','0901234567','Tuấn','bank','Paid','',37),(37,32,'2026-06-01 00:13:08',4866000,'Completed','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','hcm','q1','0901234567','Tuấn','cod','Paid','',37),(38,32,'2026-06-15 01:30:29',36646.2,'Pending','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','hcm','q1','0901234567','Tuấn','cod','Unpaid','',NULL),(39,32,'2026-06-22 16:20:54',12530000,'Pending','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','hcm','q1','0901234567','Tuấn','cod','Unpaid','',NULL),(40,32,'2026-06-22 16:33:33',26030000,'Completed','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','hcm','q1','0901234567','Tuấn','cod','Paid','',37),(41,32,'2026-06-28 14:41:24',19230000,'Pending','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','hcm','q1','0901234567','Tuấn','bank','Unpaid','',NULL),(42,32,'2026-06-28 15:05:47',12530000,'Pending','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','hcm','q1','0901234567','Tuấn','bank','Unpaid','',NULL),(43,32,'2026-06-29 15:59:38',27030000,'Completed','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','hcm','q1','0901234567','asdf','cod','Paid','',37),(44,32,'2026-06-29 16:25:00',13530000,'Completed','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','hcm','q1','0901234567','Tuấn','cod','Paid','',37),(45,32,'2026-06-29 16:31:12',25030000,'Pending','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','hcm','q1','0901234567','Tuấn','cod','Unpaid','',NULL),(46,32,'2026-06-29 16:32:43',38400000,'Cancelled','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','hcm','q1','0901234567','Tuấn','cod','Paid','',37),(47,34,'2026-06-29 16:42:10',13500000,'Completed','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','hcm','q1','0901234567','Khách lẻ','cod','Paid','',37),(48,32,'2026-06-29 16:47:29',13500000,'Pending','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','hcm','q1','0901234567','Tuấn','cod','Unpaid','',NULL),(49,32,'2026-06-29 16:47:46',13500000,'Completed','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','hcm','q1','0901234567','Tuấn','cod','Paid','không nhận sáng ',37),(50,32,'2026-06-29 17:21:12',12500000,'Completed','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','Thành phố Hà Nội','Phường Phương Liệt','0901234567','Tuấn','cod','Paid','',37),(51,32,'2026-06-29 21:21:42',19200000,'Pending','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','Thành phố Hà Nội','Phường Tây Hồ','0901234567','Tuấn','cod','Unpaid','',NULL),(52,32,'2026-06-29 21:22:48',12500000,'Cancelled','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','Tỉnh Điện Biên','Xã Mường Pồn','0901234567','Tuấn','cod','Unpaid','',NULL),(53,32,'2026-06-29 22:47:58',22400000,'Completed','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','Tỉnh Thanh Hoá','Xã Phú Lệ','0901234567','Tuấn','cod','Paid','',37),(54,32,'2026-06-29 22:48:29',29050000,'Completed','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','Tỉnh Hà Tĩnh','Xã Đức Quang','0901234567','Tuấn','bank','Unpaid','',37);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_id` int DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `price` int DEFAULT NULL,
  `discount` int DEFAULT NULL,
  `thumbnail` longtext,
  `description` longtext,
  `deleted` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_product_category` (`category_id`),
  CONSTRAINT `fk_product_category` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (1,1,'Laptop Dell Inspiron 19',15000000,10,'https://ttcenter.com.vn/uploads/product/vbpz7rhu-989-acer-nitro-5-an515-57-core-i5-11400h-8gb-512gb-rtx-1650-15-fhd-ips-144hz.jpg','Laptop Dell bền bỉ, hiệu năng ổn định cho học tập và văn phòng.',1,NULL,'2026-06-29 15:11:04'),(2,2,'PC Gaming Ryzen 5 RTX 4060',25000000,50,'https://bizweb.dktcdn.net/thumb/large/100/487/158/products/1-5172ed2c-0623-4ccf-ba7b-7d9061ed5ead.jpg?v=1729440786813','PC chơi game mạnh mẽ, CPU Ryzen 5, VGA RTX 4060, RAM 16GB.',0,NULL,'2025-06-08 06:30:44'),(3,3,'RAM DDR4 16GB Bus 3200MHz',1200000,5,'ram_ddr4_16gb.jpg','RAM DDR4 chính hãng, tốc độ cao phù hợp cho cả game và làm việc.',0,NULL,NULL),(4,4,'Màn hình LG UltraWide 29 inch',5200000,7,'monitor_lg_ultrawide_29.jpg','Màn hình LG tỉ lệ 21:9, phù hợp đa nhiệm và giải trí.',0,NULL,NULL),(5,5,'Bàn phím cơ AKKO 3068B',1500000,10,'https://akkogear.com.vn/wp-content/uploads/2021/11/ban-phim-co-akko-3068b-multi-modes-black-pink-01.jpg','Bàn phím cơ không dây, thiết kế nhỏ gọn, nhiều switch tùy chọn.',0,NULL,'2025-06-08 06:56:27'),(6,6,'Chuột Logitech G304',800000,8,'logitech_g304.jpg','Chuột gaming không dây, cảm biến HERO chính xác.',0,NULL,NULL),(7,7,'Tai nghe Razer Kraken X',1300000,12,'razer_kraken_x.jpg','Tai nghe gaming 7.1, nhẹ và đeo thoải mái nhiều giờ.',0,NULL,NULL),(8,8,'Loa Soundmax A2122',950000,5,'soundmax_a2122.jpg','Loa 2.1 công suất lớn, âm thanh mạnh mẽ phù hợp giải trí.',0,NULL,NULL),(9,9,'Router WiFi TP-Link Archer AX55',1900000,10,'tplink_archer_ax55.jpg','Router WiFi 6 tốc độ cao, phù hợp cho nhà nhiều thiết bị.',0,NULL,NULL),(10,10,'Giá đỡ màn hình NB F80',600000,0,'gia_do_nb_f80.jpg','Giá đỡ màn hình tiện lợi, dễ dàng điều chỉnh độ cao và góc nghiêng.',0,NULL,NULL),(11,2,'Acer Nitro 5 sieu ngu',230000000,10,'/assets/img/vbpz7rhu-989-acer-nitro-5-an515-57-core-i5-11400h-8gb-512gb-rtx-1650-15-fhd-ips-144hz.jpg','Laptop acer nitro 5 giảm giá',0,'2025-06-08 05:05:47','2025-06-08 05:31:17'),(12,2,'blue archive',100000,10,'https://www.tnc.com.vn/uploads/product/sp2024/ext/laptop-hp-15-fd1043tu-core-5-9z2w9pa-134462.jpg','luu tru xanh',0,'2025-06-12 16:22:39','2025-06-12 16:22:39'),(13,2,'hehe',100000,10,'','',0,'2025-06-12 20:22:00','2025-06-12 20:22:00'),(14,2,'test',100,NULL,'','',0,'2025-06-12 20:23:30','2025-06-12 20:23:30'),(15,10,'blabla',2000000,20,'','sdfadf',0,'2025-06-12 20:59:35','2025-06-12 21:06:34'),(16,1,'Laptop acer',10000000,20,'https://ktmt.vnmediacdn.com/images/2022/03/16/5-1647399987-hinh-anh-bao-ve-moi-truong-kinhtemoitruong-3.jpg','laptop bao ve moi truong',0,'2025-06-13 07:16:31','2025-06-13 07:17:32'),(17,1,'Lecoo Fighter',6996,5,'https://sazo.vn/storage/products/lecoo-fighter-7000-r9/1.png','Laptop gia re',0,'2025-11-04 14:34:02','2025-11-04 14:34:02'),(18,1,'acer 5',6996,10,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_ng_n_21__2_8.png','Laptop acer nitro 5',0,'2025-11-05 09:12:23','2025-11-05 09:12:23'),(19,1,'Lecoo Fighter',23478432,2,'https://sazo.vn/storage/products/lecoo-fighter-7000-r9/1.png','laptop gaming',0,'2025-12-02 12:58:01','2025-12-02 12:58:01'),(20,2,'Bộ PC ',36000000,5,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnE2uOywMYp2FUs4-arMLxhYQVJ2ZA6U6KkA&s','Con chó cao bằng bộ PC ',0,'2025-12-30 12:20:18','2025-12-30 12:20:18'),(21,1,'acer 5',23990000,10,'https://bizweb.dktcdn.net/thumb/grande/100/512/769/products/aspire-3-3.jpg?v=1712986187000','Laptop gaming 2026',0,'2026-01-01 08:49:56','2026-01-01 08:49:56'),(22,3,'32GB RAM DDR5',32000000,40,'https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/ram-pc-kingston-fury-beast-rgb-32gb-3200mhz-ddr4-2x16gb-kf432c16bb2ak2-335e2c12-0bdc-4bb6-a4f9-4a3522feeaa2-jpg-v-1699341982550-a382299e-14a8-4fb0-b88e-f014a1399189.jpg?v=1701360034517','Ram DDR5',0,'2026-01-10 07:58:07','2026-01-10 07:58:07'),(23,3,'16GB RAM DDR5',5000000,0,'https://media.kingston.com/kingston/content/ktc-content-ddr5-overview-difference.jpg','Ram sieu dat',0,'2026-01-13 13:41:19','2026-01-13 13:41:19'),(24,1,'Lecoo Fighter',28000000,20,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRg6sJAtuDYArLMhjiAdC9WK1UWca15MNX8Ag&s','laptop gaming gia re',0,'2026-04-12 18:45:01','2026-04-12 18:45:01'),(25,3,'RTX 5090',90000000,5,'https://hoanghapc.vn/media/product/5694_rtx_5090_windforce_oc_32g_ha1.jpg','Khám phá card màn hình MSI GeForce RTX 5090 LIGHTNING Z 32GB\n',0,'2026-06-29 16:01:56','2026-06-29 16:01:56'),(26,3,'RTX 5080',72000000,5,'https://cdn.hstatic.net/files/200000722513/file/card-man-hinh-msi-geforce-rtx-5090-lightning-z-32gb-6.jpg','MSI GeForce RTX 5090 32G LIGHTNING Z là mẫu VGA đầu bảng của MSI, được tạo ra cho game thủ hardcore, OCer và nhà sáng tạo nội dung cần hiệu năng đồ họa cực hạn ở độ phân giải 4K thậm chí 8K. Card sử dụng GPU NVIDIA GeForce RTX 5090 kiến trúc Blackwell mới mang lại sức mạnh xử lý vượt trội cho cả gaming lẫn các workflow dựng phim, 3D, AI.',0,'2026-06-29 16:04:25','2026-06-29 16:04:25'),(27,3,'RTX 5070',60000000,20,'https://cdn.hstatic.net/files/200000722513/file/card-man-hinh-msi-geforce-rtx-5090-lightning-z-32gb-8.jpg','Khám phá card màn hình ASUS Prime GeForce RTX 5070 12GB GDDR7 OC White Edition\nASUS Prime GeForce RTX 5070 12GB GDDR7 OC White Edition là lựa chọn đáng chú ý dành cho game thủ, nhà sáng tạo nội dung và người dùng muốn xây dựng một hệ thống PC tông trắng hiện đại. Sản phẩm kết hợp sức mạnh từ kiến trúc NVIDIA Blackwell, bộ nhớ GDDR7 thế hệ mới cùng thiết kế White Edition nổi bật, mang đến sự cân bằng giữa hiệu năng và tính thẩm mỹ.\n\nKiến trúc NVIDIA Blackwell và hiệu suất AI thế hệ mới\nRTX 5070 được xây dựng trên nền tảng kiến trúc NVIDIA Blackwell, mang đến những cải tiến đáng kể về hiệu suất xử lý đồ họa và khả năng tăng tốc AI. Card đồ hoạ sở hữu hiệu năng AI lên đến 1005 TOPS, hỗ trợ hiệu quả cho các ứng dụng sáng tạo nội dung, xử lý hình ảnh, video và những công cụ AI hiện đại đang ngày càng phổ biến hiện nay.\n\nBên cạnh hiệu suất AI, kiến trúc Blackwell còn cải thiện khả năng xử lý Ray Tracing và tối ưu hiệu quả năng lượng so với các thế hệ trước. Điều này giúp card vận hành hiệu quả hơn trong cả gaming lẫn công việc chuyên môn, đặc biệt là khi thực hiện các tác vụ render đòi hỏi cấu hình mạnh.',0,'2026-06-29 16:11:13','2026-06-29 16:11:13'),(28,1,'Laptop Dell Inspiron 21',23000000,0,'https://cdn.tgdd.vn/Products/Images/44/311210/dell-vostro-15-3520-i3-5m2tt1-090823-041032-600x600.png','laptop gaming',0,'2026-06-29 16:17:47','2026-06-29 16:17:47'),(29,3,'RTX 5090',345345,0,'https://ttcenter.com.vn/uploads/product/vbpz7rhu-989-acer-nitro-5-an515-57-core-i5-11400h-8gb-512gb-rtx-1650-15-fhd-ips-144hz.jpg','test',1,'2026-06-29 16:18:48','2026-06-29 16:19:03');
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(40) NOT NULL,
  `description` varchar(150) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (2,'ROLE_CASHIER','Phụ trách thanh toán và hóa đơn'),(3,'ROLE_WAREHOUSE_MANAGER','Quản lý hàng tồn kho và nhập xuất'),(5,'ROLE_TECHNICAL_STAFF','Xử lý kỹ thuật và bảo trì thiết bị'),(6,'ROLE_SHIPPER','Giao hàng đến khách'),(7,'ROLE_SALES_STAFF','Tư vấn và bán sản phẩm cho khách'),(8,'ROLE_CUSTOMER_SERVICE','Nhân viên chăm sóc khách hàng (Hỗ trợ, giải quyết khiếu nại)'),(9,'ROLE_ADMIN','Quản trị hệ thống và phân quyền'),(10,'ROLE_DIRECTOR','Quản lý toàn bộ hoạt động kinh doanh'),(11,'ROLE_USER','Vai trò mặc định cho người dùng hệ thống'),(12,'ROLE_ORDER_MANAGER','Quản lý các đơn');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service_categories`
--

DROP TABLE IF EXISTS `service_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `service_categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_categories`
--

LOCK TABLES `service_categories` WRITE;
/*!40000 ALTER TABLE `service_categories` DISABLE KEYS */;
INSERT INTO `service_categories` VALUES (1,'Sửa điện thoại'),(2,'Sửa laptop'),(3,'Sửa máy tính bảng'),(4,'Sửa Airpods'),(5,'Sửa Apple Watch'),(6,'Vệ sinh laptop');
/*!40000 ALTER TABLE `service_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `services` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `category_id` int DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `description` text,
  `is_active` tinyint(1) DEFAULT '1',
  `thumbnail` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES (1,'Thay màn Acer Nitro 5',3,3000000.00,'Thay màn hình Acer Nitro 5 khong re',1,'https://laptop88.vn/media/product/7949_81ldotjrtkl.jpg'),(2,'Thay màn hình Acer Nitro 5',2,67.00,NULL,1,'https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/2024_6_13_638538919441170999_bang-gia-thay-pin-iphone-chinh-hang-apple.jpg'),(3,'Thay màn hình máy tính bảng',3,1000000.00,'Thay man hinh apple gia re ',1,'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/m/image_1562.png'),(4,'Thay kính cường lực IPHONE X',1,100000.00,'Thay kính',1,'https://cdn.tgdd.vn/Products/Images/42/114115/iphone-x-64gb-hh-600x600.jpg');
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock_adjustment`
--

DROP TABLE IF EXISTS `stock_adjustment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock_adjustment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int DEFAULT NULL,
  `adjusted_by` int DEFAULT NULL,
  `old_quantity` int DEFAULT NULL,
  `new_quantity` int DEFAULT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `store_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `adjusted_by` (`adjusted_by`),
  CONSTRAINT `stock_adjustment_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `stock_adjustment_ibfk_2` FOREIGN KEY (`adjusted_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_adjustment`
--

LOCK TABLES `stock_adjustment` WRITE;
/*!40000 ALTER TABLE `stock_adjustment` DISABLE KEYS */;
INSERT INTO `stock_adjustment` VALUES (1,1,33,10,12,'Nhập nhầm số lượng ','2026-05-02 18:46:33',1),(2,1,18,12,13,'Lech kiem ke','2026-05-02 18:59:41',1),(3,1,33,15,16,'Nhap nham','2026-05-03 00:41:51',1),(4,2,33,10,11,'nhap nham','2026-05-04 14:38:37',1),(5,1,33,20,23,'nhap nham','2026-05-04 14:47:33',1),(6,2,33,11,10,'lay hang cho ship','2026-05-04 14:49:31',1),(7,2,33,10,11,'Nhập hàng vào kho','2026-05-31 19:23:48',1),(8,4,18,2,0,'Bán','2026-06-01 00:12:08',2),(9,2,18,16,17,'Nhập lại do nhầm','2026-06-29 22:04:14',1),(10,27,18,0,2,'Nhập ','2026-06-29 23:15:06',2);
/*!40000 ALTER TABLE `stock_adjustment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `store`
--

DROP TABLE IF EXISTS `store`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `store` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(56) DEFAULT NULL,
  `address` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `store`
--

LOCK TABLES `store` WRITE;
/*!40000 ALTER TABLE `store` DISABLE KEYS */;
INSERT INTO `store` VALUES (1,'Tech Store Hà Nội','Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội'),(2,'Tech Store Đà Nẵng','42 Bạch Đằng, Hải Châu, Đà Nẵng'),(3,'Tech Store Hồ Chí Minh','180 Lý Chính Thắng, Quận 3, TP. HCM');
/*!40000 ALTER TABLE `store` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stores_users`
--

DROP TABLE IF EXISTS `stores_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stores_users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `store_id` int NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `store_id` (`store_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `stores_users_ibfk_1` FOREIGN KEY (`store_id`) REFERENCES `store` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `stores_users_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stores_users`
--

LOCK TABLES `stores_users` WRITE;
/*!40000 ALTER TABLE `stores_users` DISABLE KEYS */;
INSERT INTO `stores_users` VALUES (1,1,3),(2,2,3),(3,1,26),(4,2,26),(5,1,33);
/*!40000 ALTER TABLE `stores_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tech_task`
--

DROP TABLE IF EXISTS `tech_task`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tech_task` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `task_type` text,
  `status` text,
  `note` text,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_tech_task_user` (`user_id`),
  CONSTRAINT `fk_tech_task_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tech_task`
--

LOCK TABLES `tech_task` WRITE;
/*!40000 ALTER TABLE `tech_task` DISABLE KEYS */;
INSERT INTO `tech_task` VALUES (2,5,'nang ram ','completed','nang ram laptop','2025-12-02 13:25:30','2025-12-02 13:43:30'),(5,5,'new te','completed','tewst','2025-12-03 09:38:13','2025-12-30 12:20:46'),(6,5,'Bộ pc','in-progress','sửa ','2025-12-30 12:20:59','2026-01-01 08:52:32'),(7,2,'fix pc','completed','heaas','2026-01-01 08:52:13','2026-03-29 15:05:01');
/*!40000 ALTER TABLE `tech_task` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(64) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` varchar(200) DEFAULT NULL,
  `deleted` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `enabled` bit(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`),
  UNIQUE KEY `unique_phone` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Nguyễn Anh Tuấn','tuna@shop.com','e10adc3949ba59abbe56e057f20f883e','0901000001','Hà Nội',0,'2025-06-08 09:46:51','2026-01-01 08:57:14',_binary '\0'),(2,'Tran Thi B','b@shop.com','e10adc3949ba59abbe56e057f20f883e','0901000002','HCM',0,'2025-06-08 09:46:51','2026-03-29 18:28:01',_binary ''),(3,'Le Van C','c@shop.com','e10adc3949ba59abbe56e057f20f883e','0901000003','Đà Nẵng',0,'2025-06-08 09:46:51','2026-04-12 18:06:50',_binary '\0'),(4,'Pham Thi D','d@shop.com','e10adc3949ba59abbe56e057f20f883e','0901000004','Cần Thơ',0,'2025-06-08 09:46:51','2026-03-29 18:28:14',_binary '\0'),(5,'Hoang Van E','e@shop.com','e10adc3949ba59abbe56e057f20f883e','0901000005','Hải Phòng',0,'2025-06-08 09:46:51','2025-06-08 09:46:51',_binary ''),(6,'Vo Thi F','f@shop.com','e10adc3949ba59abbe56e057f20f883e','0901000006','Nghệ An',0,'2025-06-08 09:46:51','2025-06-08 09:46:51',_binary '\0'),(7,'Nguyen Van G','g@shop.com','e10adc3949ba59abbe56e057f20f883e','0901000007','Quảng Ninh',0,'2025-06-08 09:46:51','2025-06-08 09:46:51',_binary '\0'),(8,'Tran Van H','h@shop.com','e10adc3949ba59abbe56e057f20f883e','0901000008','Huế',0,'2025-06-08 09:46:51','2025-06-08 09:46:51',_binary '\0'),(9,'Bui Thi I','i@shop.com','e10adc3949ba59abbe56e057f20f883e','0901000009','Lào Cai',0,'2025-06-08 09:46:51','2025-06-08 09:46:51',_binary '\0'),(10,'Dang Van J','j@shop.com','e10adc3949ba59abbe56e057f20f883e','0901000010','Nam Định',0,'2025-06-08 09:46:51','2025-06-08 09:46:51',_binary '\0'),(11,'tuannguyen','tuan.na225772@sis.hust.edu.vn','tuantech2004','0987962495','',0,'2025-06-12 18:45:01','2026-01-01 08:57:52',_binary ''),(12,'tuan.na225772@sis.hust.edu.vn','tuan.na22523772@sis.hust.edu.vn','tuantech2004','324234234234',NULL,0,'2025-06-12 20:15:53','2025-06-12 20:15:53',_binary ''),(14,'truong thi dieu linh','linh.ntd@sis.hust.edu.vn','123456','0123456789',NULL,0,'2025-06-13 07:14:13','2025-06-13 07:14:13',_binary ''),(16,'Nguyễn Tuấn','hello@gmail.com','e10adc3949ba59abbe56e057f20f883e','0901234567','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02',0,'2025-12-23 15:47:30','2026-03-29 18:28:30',_binary ''),(17,'Tuấn Nguyễn ','hello1@gmail.com','fcea920f7412b5da7be0cf42b8c93759','0912431234','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02',0,'2025-12-24 09:30:51','2026-03-29 18:28:40',_binary ''),(18,'Super Admin','admin@techzone.vn','e10adc3949ba59abbe56e057f20f883e','0987962456',NULL,0,'2025-12-30 12:28:28','2026-06-29 10:09:20',_binary ''),(19,'tuna','bla@gmail.com','e10adc3949ba59abbe56e057f20f883e','123','haha',0,'2026-01-16 08:10:21','2026-04-12 18:07:10',_binary ''),(20,'Tuan Nguyen','hellowol@gmail.com','fcea920f7412b5da7be0cf42b8c93759','0987962494','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02',0,'2026-01-16 10:10:03','2026-03-29 18:28:59',_binary ''),(21,'quản lý kho','wm@techzone.vn','e10adc3949ba59abbe56e057f20f883e','0901234532','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02',0,'2026-04-12 18:11:59','2026-04-12 18:11:59',_binary ''),(24,'asdf','tuan32876@gmail.com','e10adc3949ba59abbe56e057f20f883e','0901234531','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02',0,'2026-04-12 18:13:42','2026-05-02 16:39:33',_binary ''),(26,'asdf','tuan21355@gmail.com','e10adc3949ba59abbe56e057f20f883e','0901234134','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02',0,'2026-04-12 18:15:13','2026-04-12 18:15:49',_binary ''),(27,'cashier_test','cashier@gmail.com','e10adc3949ba59abbe56e057f20f883e','123895437234','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02',0,'2026-04-12 18:35:25','2026-04-12 18:35:45',_binary ''),(28,'order_manager','ordermanager@gmail.com','e10adc3949ba59abbe56e057f20f883e','23445323446','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02',0,'2026-04-12 18:37:03','2026-04-12 18:39:54',_binary ''),(29,'techstaff','techstaff@gmail.com','e10adc3949ba59abbe56e057f20f883e','23465234123','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02',0,'2026-04-12 18:41:01','2026-04-12 18:41:19',_binary ''),(30,'salestaff','salestaff@gmail.com','e10adc3949ba59abbe56e057f20f883e','2345431254','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02',0,'2026-04-12 18:42:19','2026-04-12 18:42:38',_binary ''),(31,'director','director@gmail.com','e10adc3949ba59abbe56e057f20f883e','234897345','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02',0,'2026-04-12 18:43:23','2026-04-12 18:43:46',_binary ''),(32,'user','user@gmail.com','e10adc3949ba59abbe56e057f20f883e','23465234','123 Đường ABC, Q.1, TP.HCM',0,'2026-04-12 18:49:00','2026-04-12 18:49:00',_binary ''),(33,'warehousemanager','warehousemanager@techzone.vn','e10adc3949ba59abbe56e057f20f883e','2349872345','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02',0,'2026-04-13 05:49:18','2026-04-13 05:49:37',_binary ''),(34,'Ghost User','ghost@example.com','ghostpassword',NULL,NULL,0,'2026-05-02 10:45:11','2026-05-02 10:45:11',_binary ''),(37,'Shipper','shipper@gmail.com','e10adc3949ba59abbe56e057f20f883e','23948435','blabla',0,'2026-05-02 16:44:24','2026-05-02 16:46:52',_binary ''),(39,'Tuấn','quanlydon@gmail.com','e10adc3949ba59abbe56e057f20f883e','0901234568','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02',0,'2026-06-29 10:05:45','2026-06-29 10:05:45',_binary ''),(45,'Tuấn','admin4@techzone.vn','e10adc3949ba59abbe56e057f20f883e','0901234523','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02',0,'2026-06-29 10:08:01','2026-06-29 10:08:01',_binary ''),(48,'Tuấn','admsadfin@techzone.vn','e10adc3949ba59abbe56e057f20f883e','09012345672','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02',0,'2026-06-29 10:08:14','2026-06-29 10:08:14',_binary '');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_roles`
--

DROP TABLE IF EXISTS `users_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `role_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_users_roles_user` (`user_id`),
  KEY `fk_users_roles_role` (`role_id`),
  CONSTRAINT `fk_users_roles_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
  CONSTRAINT `fk_users_roles_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_roles`
--

LOCK TABLES `users_roles` WRITE;
/*!40000 ALTER TABLE `users_roles` DISABLE KEYS */;
INSERT INTO `users_roles` VALUES (3,3,3),(5,5,5),(6,6,6),(7,7,7),(8,8,8),(9,9,9),(10,10,10),(12,12,11),(13,14,11),(17,18,9),(18,1,9),(19,11,11),(24,2,5),(25,4,2),(26,16,6),(27,17,6),(29,20,6),(30,19,3),(34,26,3),(36,27,2),(38,28,12),(40,29,5),(42,30,7),(44,31,10),(45,32,11),(47,33,3),(48,24,6),(50,37,6),(51,39,12),(52,45,9),(53,48,9);
/*!40000 ALTER TABLE `users_roles` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-30  0:35:20

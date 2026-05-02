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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (1,1,'2025-12-01 15:31:39'),(2,16,'2025-12-23 15:47:41'),(3,17,'2025-12-24 09:31:00'),(4,18,'2025-12-30 12:36:54');
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
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_item`
--

LOCK TABLES `cart_item` WRITE;
/*!40000 ALTER TABLE `cart_item` DISABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory`
--

LOCK TABLES `inventory` WRITE;
/*!40000 ALTER TABLE `inventory` DISABLE KEYS */;
INSERT INTO `inventory` VALUES (1,1,1,5),(2,1,2,16),(3,1,3,10),(4,2,1,5),(5,2,2,8),(6,3,3,20),(7,4,1,0),(8,5,2,10),(9,6,3,15),(10,7,1,22),(11,8,2,21),(12,9,3,11),(13,10,1,13),(14,11,1,6),(15,11,2,1),(16,11,3,5),(17,2,3,0),(18,5,1,2),(19,5,3,0),(20,12,1,2),(21,12,2,2),(22,12,3,3),(23,13,1,0),(24,13,2,0),(25,13,3,0),(26,14,1,0),(27,14,2,0),(28,14,3,0),(29,7,2,0),(30,7,3,5),(31,6,1,4),(32,6,2,2),(33,15,1,1),(34,15,2,1),(35,15,3,1),(36,16,1,1),(37,16,2,1),(38,16,3,0),(39,10,2,1),(40,10,3,0),(41,4,2,0),(42,17,1,1),(43,17,2,2),(44,17,3,3),(45,18,1,1),(46,18,2,3),(47,18,3,3),(48,19,1,1),(49,19,2,1),(50,19,3,0),(51,20,1,1),(52,20,2,2),(53,20,3,3),(54,21,1,1),(55,21,2,2),(56,21,3,3),(57,22,1,3),(58,22,2,1),(59,22,3,0);
/*!40000 ALTER TABLE `inventory` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,1,1,2,16200000),(2,1,2,4,12500000),(3,1,3,3,1140000),(4,2,11,1,207000000),(5,3,11,1,207000000),(6,3,6,1,736000),(7,4,2,2,12500000),(8,4,12,2,90000),(9,5,1,1,16200000),(10,6,1,1,16200000),(11,6,2,2,12500000),(12,7,2,3,12500000),(13,7,5,4,1350000),(14,8,2,1,12500000),(15,8,12,3,90000),(16,9,2,2,12500000),(17,9,9,2,1710000),(18,9,12,2,90000),(19,10,1,3,14400000),(20,10,2,1,12500000),(21,11,2,1,12500000),(22,11,16,2,8000000),(23,12,1,3,14400000),(24,12,2,2,12500000),(25,13,4,1,4836000),(26,14,1,1,14400000);
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
  PRIMARY KEY (`id`),
  KEY `fk_orders_user` (`user_id`),
  CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,1,'2025-12-01 23:20:10',85850000,'Pending','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','hcm','q1','adf','asdf','cod','Unpaid',''),(2,1,'2025-12-02 19:57:03',207030000,'Pending','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','hcm','q1','0901234567','asdf','cod','Unpaid',''),(3,1,'2025-12-02 20:49:17',207766000,'Pending','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','hcm','q2','456','asdf','cod','Unpaid',''),(4,1,'2025-12-03 16:35:14',25210000,'Shipping','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','hn','q1','10123','tuan','cod','Paid','note'),(5,1,'2025-12-23 22:28:57',16230000,'Pending','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','hcm','q1','0901234567','asdf','bank','Unpaid',''),(6,16,'2025-12-23 22:48:38',41230000,'Completed','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','hcm','q1','0901234567','Tuấn','momo','Paid',''),(7,16,'2025-12-23 23:09:34',42930000,'Completed','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','hcm','q1','0901234567','Tuấn','bank','Paid','dsasad'),(8,17,'2025-12-24 16:32:30',12800000,'Processing','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','hcm','q1','0901234567','Tuấn ','momo','Paid','24 thang 12 '),(9,16,'2025-12-30 19:35:36',28630000,'Cancelled','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','hcm','q1','0901234567','Tuấn','bank','Paid',''),(10,16,'2026-01-01 15:42:52',55730000,'Pending','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','hn','q2','0987962495','tuan','cod','Unpaid',''),(11,16,'2026-01-01 15:44:16',28530000,'Pending','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','hn','q1','0987962495','tuan','cod','Paid',''),(12,16,'2026-01-10 14:27:25',68230000,'Shipping','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','hn','q1','0987962495','tuan','cod','Paid',''),(13,16,'2026-01-10 14:42:00',4866000,'Completed','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','hn','q1','0987962495','tuan','cod','Paid',''),(14,16,'2026-01-13 20:31:18',14430000,'Completed','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02','hn','q1','0987962495','tuan','cod','Paid','');
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
  `thumbnail` tinytext,
  `description` tinytext,
  `deleted` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_product_category` (`category_id`),
  CONSTRAINT `fk_product_category` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (1,1,'Laptop Dell Inspiron 17',16000000,10,'https://ttcenter.com.vn/uploads/product/vbpz7rhu-989-acer-nitro-5-an515-57-core-i5-11400h-8gb-512gb-rtx-1650-15-fhd-ips-144hz.jpg','Laptop Dell bền bỉ, hiệu năng ổn định cho học tập và văn phòng.',0,NULL,'2026-01-10 07:29:14'),(2,2,'PC Gaming Ryzen 5 RTX 4060',25000000,50,'https://bizweb.dktcdn.net/thumb/large/100/487/158/products/1-5172ed2c-0623-4ccf-ba7b-7d9061ed5ead.jpg?v=1729440786813','PC chơi game mạnh mẽ, CPU Ryzen 5, VGA RTX 4060, RAM 16GB.',0,NULL,'2025-06-08 06:30:44'),(3,3,'RAM DDR4 16GB Bus 3200MHz',1200000,5,'ram_ddr4_16gb.jpg','RAM DDR4 chính hãng, tốc độ cao phù hợp cho cả game và làm việc.',0,NULL,NULL),(4,4,'Màn hình LG UltraWide 29 inch',5200000,7,'monitor_lg_ultrawide_29.jpg','Màn hình LG tỉ lệ 21:9, phù hợp đa nhiệm và giải trí.',0,NULL,NULL),(5,5,'Bàn phím cơ AKKO 3068B',1500000,10,'https://akkogear.com.vn/wp-content/uploads/2021/11/ban-phim-co-akko-3068b-multi-modes-black-pink-01.jpg','Bàn phím cơ không dây, thiết kế nhỏ gọn, nhiều switch tùy chọn.',0,NULL,'2025-06-08 06:56:27'),(6,6,'Chuột Logitech G304',800000,8,'logitech_g304.jpg','Chuột gaming không dây, cảm biến HERO chính xác.',0,NULL,NULL),(7,7,'Tai nghe Razer Kraken X',1300000,12,'razer_kraken_x.jpg','Tai nghe gaming 7.1, nhẹ và đeo thoải mái nhiều giờ.',0,NULL,NULL),(8,8,'Loa Soundmax A2122',950000,5,'soundmax_a2122.jpg','Loa 2.1 công suất lớn, âm thanh mạnh mẽ phù hợp giải trí.',0,NULL,NULL),(9,9,'Router WiFi TP-Link Archer AX55',1900000,10,'tplink_archer_ax55.jpg','Router WiFi 6 tốc độ cao, phù hợp cho nhà nhiều thiết bị.',0,NULL,NULL),(10,10,'Giá đỡ màn hình NB F80',600000,0,'gia_do_nb_f80.jpg','Giá đỡ màn hình tiện lợi, dễ dàng điều chỉnh độ cao và góc nghiêng.',0,NULL,NULL),(11,2,'Acer Nitro 5 sieu ngu',230000000,10,'/assets/img/vbpz7rhu-989-acer-nitro-5-an515-57-core-i5-11400h-8gb-512gb-rtx-1650-15-fhd-ips-144hz.jpg','Laptop acer nitro 5 giảm giá',0,'2025-06-08 05:05:47','2025-06-08 05:31:17'),(12,2,'blue archive',100000,10,'https://www.tnc.com.vn/uploads/product/sp2024/ext/laptop-hp-15-fd1043tu-core-5-9z2w9pa-134462.jpg','luu tru xanh',0,'2025-06-12 16:22:39','2025-06-12 16:22:39'),(13,2,'hehe',100000,10,'','',0,'2025-06-12 20:22:00','2025-06-12 20:22:00'),(14,2,'test',100,NULL,'','',0,'2025-06-12 20:23:30','2025-06-12 20:23:30'),(15,10,'blabla',2000000,20,'','sdfadf',0,'2025-06-12 20:59:35','2025-06-12 21:06:34'),(16,1,'Laptop acer',10000000,20,'https://ktmt.vnmediacdn.com/images/2022/03/16/5-1647399987-hinh-anh-bao-ve-moi-truong-kinhtemoitruong-3.jpg','laptop bao ve moi truong',0,'2025-06-13 07:16:31','2025-06-13 07:17:32'),(17,1,'Lecoo Fighter',6996,5,'https://sazo.vn/storage/products/lecoo-fighter-7000-r9/1.png','Laptop gia re',0,'2025-11-04 14:34:02','2025-11-04 14:34:02'),(18,1,'acer 5',6996,10,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_ng_n_21__2_8.png','Laptop acer nitro 5',0,'2025-11-05 09:12:23','2025-11-05 09:12:23'),(19,1,'Lecoo Fighter',23478432,2,'https://sazo.vn/storage/products/lecoo-fighter-7000-r9/1.png','laptop gaming',0,'2025-12-02 12:58:01','2025-12-02 12:58:01'),(20,2,'Bộ PC ',36000000,5,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnE2uOywMYp2FUs4-arMLxhYQVJ2ZA6U6KkA&s','Con chó cao bằng bộ PC ',0,'2025-12-30 12:20:18','2025-12-30 12:20:18'),(21,1,'acer 5',23990000,10,'https://bizweb.dktcdn.net/thumb/grande/100/512/769/products/aspire-3-3.jpg?v=1712986187000','Laptop gaming 2026',0,'2026-01-01 08:49:56','2026-01-01 08:49:56'),(22,3,'32GB RAM DDR5',32000000,40,'https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/ram-pc-kingston-fury-beast-rgb-32gb-3200mhz-ddr4-2x16gb-kf432c16bb2ak2-335e2c12-0bdc-4bb6-a4f9-4a3522feeaa2-jpg-v-1699341982550-a382299e-14a8-4fb0-b88e-f014a1399189.jpg?v=1701360034517','Ram DDR5',0,'2026-01-10 07:58:07','2026-01-10 07:58:07');
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
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'ROLE_CUSTOMER','Người sử dụng dịch vụ hoặc mua hàng'),(2,'ROLE_CASHIER','Phụ trách thanh toán và hóa đơn'),(3,'ROLE_WAREHOUSE_MANAGER','Quản lý hàng tồn kho và nhập xuất'),(4,'ROLE_HR_MANAGER','Quản lý thông tin và công việc nhân viên'),(5,'ROLE_TECHNICAL_STAFF','Xử lý kỹ thuật và bảo trì thiết bị'),(6,'ROLE_SHIPPER','Giao hàng đến khách'),(7,'ROLE_SALES_STAFF','Tư vấn và bán sản phẩm cho khách'),(8,'ROLE_CUSTOMER_SERVICE','Nhân viên chăm sóc khách hàng (Hỗ trợ, giải quyết khiếu nại)'),(9,'ROLE_ADMIN','Quản trị hệ thống và phân quyền'),(10,'ROLE_DIRECTOR','Quản lý toàn bộ hoạt động kinh doanh'),(11,'ROLE_USER','Vai trò mặc định cho người dùng hệ thống');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
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
INSERT INTO `tech_task` VALUES (1,15,'task sua laptop','completed','nang ram','2025-12-02 13:17:56','2026-01-01 08:52:02'),(2,5,'nang ram ','completed','nang ram laptop','2025-12-02 13:25:30','2025-12-02 13:43:30'),(3,15,'sdf','completed','fdsa','2025-12-02 13:40:06','2025-12-03 09:37:47'),(4,15,'sua laptop','in-progress','nang ram','2025-12-03 09:37:14','2026-01-01 08:52:35'),(5,5,'new te','completed','tewst','2025-12-03 09:38:13','2025-12-30 12:20:46'),(6,5,'Bộ pc','in-progress','sửa ','2025-12-30 12:20:59','2026-01-01 08:52:32'),(7,2,'fix pc','pending','heaas','2026-01-01 08:52:13','2026-01-01 08:58:14');
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
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Nguyễn Anh Tuấn','tuna@shop.com','e10adc3949ba59abbe56e057f20f883e','0901000001','Hà Nội',0,'2025-06-08 09:46:51','2026-01-01 08:57:14',_binary '\0'),(2,'Tran Thi B','b@shop.com','e10adc3949ba59abbe56e057f20f883e','0901000002','HCM',0,'2025-06-08 09:46:51','2026-01-01 08:58:10',_binary ''),(3,'Le Van C','c@shop.com','e10adc3949ba59abbe56e057f20f883e','0901000003','Đà Nẵng',0,'2025-06-08 09:46:51','2025-06-08 09:46:51',_binary '\0'),(4,'Pham Thi D','d@shop.com','e10adc3949ba59abbe56e057f20f883e','0901000004','Cần Thơ',0,'2025-06-08 09:46:51','2025-06-08 09:46:51',_binary '\0'),(5,'Hoang Van E','e@shop.com','e10adc3949ba59abbe56e057f20f883e','0901000005','Hải Phòng',0,'2025-06-08 09:46:51','2025-06-08 09:46:51',_binary ''),(6,'Vo Thi F','f@shop.com','e10adc3949ba59abbe56e057f20f883e','0901000006','Nghệ An',0,'2025-06-08 09:46:51','2025-06-08 09:46:51',_binary '\0'),(7,'Nguyen Van G','g@shop.com','e10adc3949ba59abbe56e057f20f883e','0901000007','Quảng Ninh',0,'2025-06-08 09:46:51','2025-06-08 09:46:51',_binary '\0'),(8,'Tran Van H','h@shop.com','e10adc3949ba59abbe56e057f20f883e','0901000008','Huế',0,'2025-06-08 09:46:51','2025-06-08 09:46:51',_binary '\0'),(9,'Bui Thi I','i@shop.com','e10adc3949ba59abbe56e057f20f883e','0901000009','Lào Cai',0,'2025-06-08 09:46:51','2025-06-08 09:46:51',_binary '\0'),(10,'Dang Van J','j@shop.com','e10adc3949ba59abbe56e057f20f883e','0901000010','Nam Định',0,'2025-06-08 09:46:51','2025-06-08 09:46:51',_binary '\0'),(11,'tuannguyen','tuan.na225772@sis.hust.edu.vn','tuantech2004','0987962495','',0,'2025-06-12 18:45:01','2026-01-01 08:57:52',_binary ''),(12,'tuan.na225772@sis.hust.edu.vn','tuan.na22523772@sis.hust.edu.vn','tuantech2004','324234234234',NULL,0,'2025-06-12 20:15:53','2025-06-12 20:15:53',_binary ''),(14,'truong thi dieu linh','linh.ntd@sis.hust.edu.vn','123456','0123456789',NULL,0,'2025-06-13 07:14:13','2025-06-13 07:14:13',_binary ''),(15,'Nguyen Van A','nguyenvana@example.com','hashed_password_example_1234567890abcdef','0901234567','123 Đường ABC, Quận 1, TP.HCM',0,'2025-12-02 13:45:27','2025-12-02 13:45:27',_binary ''),(16,'Nguyễn Tuấn','hello@gmail.com','e10adc3949ba59abbe56e057f20f883e','0901234567','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02',0,'2025-12-23 15:47:30','2025-12-23 15:47:30',_binary ''),(17,'Tuấn Nguyễn ','hello1@gmail.com','fcea920f7412b5da7be0cf42b8c93759','0912431234','đại học bách khoa hà nội đường trần đại nghĩa việt nhật 02',0,'2025-12-24 09:30:51','2025-12-24 09:31:46',_binary ''),(18,'Super Admin','admin@techzone.vn','e10adc3949ba59abbe56e057f20f883e',NULL,NULL,0,'2025-12-30 12:28:28',NULL,_binary '');
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
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_roles`
--

LOCK TABLES `users_roles` WRITE;
/*!40000 ALTER TABLE `users_roles` DISABLE KEYS */;
INSERT INTO `users_roles` VALUES (3,3,3),(4,4,4),(5,5,5),(6,6,6),(7,7,7),(8,8,8),(9,9,9),(10,10,10),(12,12,11),(13,14,11),(14,15,5),(15,16,1),(16,17,1),(17,18,9),(18,1,9),(19,11,11),(20,2,5);
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

-- Dump completed on 2026-01-13 20:33:01

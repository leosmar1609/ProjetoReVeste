-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: beneficiarios
-- ------------------------------------------------------
-- Server version	8.3.0

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
-- Table structure for table `doador`
--

DROP TABLE IF EXISTS `doador`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doador` (
  `id` int NOT NULL AUTO_INCREMENT,
  `namedonor` varchar(255) NOT NULL,
  `emaildonor` varchar(100) NOT NULL,
  `passworddonor` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doador`
--

LOCK TABLES `doador` WRITE;
/*!40000 ALTER TABLE `doador` DISABLE KEYS */;
/*!40000 ALTER TABLE `doador` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `instituicao_beneficiaria`
--

DROP TABLE IF EXISTS `instituicao_beneficiaria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `instituicao_beneficiaria` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nameInc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `emailInc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `passwordInc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `cnpjInc` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `locationInc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `historyInc` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `verificada` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `instituicao_beneficiaria`
--

LOCK TABLES `instituicao_beneficiaria` WRITE;
/*!40000 ALTER TABLE `instituicao_beneficiaria` DISABLE KEYS */;
INSERT INTO `instituicao_beneficiaria` VALUES (9,'Mais Teste','biabia@gmail.com','6544321','77894888493',NULL,'sdjknjvd',NULL),(10,'TesteINC','leo.marcos6440@gmail.com','testeemail','77894888493','rua charmelion, 15','a hist e bem legal',0);
/*!40000 ALTER TABLE `instituicao_beneficiaria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedidos`
--

DROP TABLE IF EXISTS `pedidos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedidos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name_item` varchar(255) DEFAULT NULL,
  `description` text,
  `quantity_item` int NOT NULL,
  `category` varchar(255) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'open',
  `urgencia_enum` enum('Baixa','Média','Alta','Urgente') NOT NULL,
  `locate` varchar(255) NOT NULL,
  `opened_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `pessoa_beneficiaria_id` int DEFAULT NULL,
  `instituicao_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `pessoa_beneficiaria_id` (`pessoa_beneficiaria_id`),
  KEY `instituicao_id` (`instituicao_id`),
  CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`pessoa_beneficiaria_id`) REFERENCES `pessoa_beneficiaria` (`id`),
  CONSTRAINT `pedidos_ibfk_2` FOREIGN KEY (`instituicao_id`) REFERENCES `instituicao_beneficiaria` (`id`),
  CONSTRAINT `pedidos_chk_1` CHECK ((`category` in (_utf8mb4'roupas',_utf8mb4'alimentos',_utf8mb4'móveis',_utf8mb4'eletrônicos',_utf8mb4'brinquedos'))),
  CONSTRAINT `pedidos_chk_2` CHECK ((`status` in (_utf8mb4'open',_utf8mb4'in_progress',_utf8mb4'closed',_utf8mb4'cancelled')))
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedidos`
--

LOCK TABLES `pedidos` WRITE;
/*!40000 ALTER TABLE `pedidos` DISABLE KEYS */;
INSERT INTO `pedidos` VALUES (1,'Salgadinho','ggghhhhh',3,'alimentos','open','Urgente','Rua Gaivota, 16','2025-04-16 02:03:06','2025-04-16 02:03:06',NULL,NULL),(2,'Salgadinho','kaslndlsndkasjnd',3,'alimentos','open','Urgente','Rua Gaivota, 16','2025-04-16 02:20:19','2025-04-16 02:20:19',NULL,NULL),(3,'Salgadinho','kbjh,bljb',3,'alimentos','open','Urgente','Rua Gaivota, 16','2025-04-16 02:24:02','2025-04-16 02:24:02',NULL,NULL),(4,'Salgadinho','kkkkkkk',3,'alimentos','open','Urgente','Rua Gaivota, 16','2025-04-16 02:26:20','2025-04-16 02:26:20',NULL,NULL),(5,'Salgadinho','lasttest',3,'alimentos','open','Urgente','Rua Gaivota, 16','2025-04-16 02:27:51','2025-04-16 02:27:51',NULL,NULL);
/*!40000 ALTER TABLE `pedidos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pessoa_beneficiaria`
--

DROP TABLE IF EXISTS `pessoa_beneficiaria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pessoa_beneficiaria` (
  `id` int NOT NULL AUTO_INCREMENT,
  `namePer` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `emailPer` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `passwordPer` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `cpfPer` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `historyPer` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `instituicao_beneficiaria_id` int DEFAULT NULL,
  `verificado` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `instituicao_beneficiaria_id` (`instituicao_beneficiaria_id`),
  CONSTRAINT `pessoa_beneficiaria_ibfk_1` FOREIGN KEY (`instituicao_beneficiaria_id`) REFERENCES `instituicao_beneficiaria` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pessoa_beneficiaria`
--

LOCK TABLES `pessoa_beneficiaria` WRITE;
/*!40000 ALTER TABLE `pessoa_beneficiaria` DISABLE KEYS */;
INSERT INTO `pessoa_beneficiaria` VALUES (1,'Leonardo','kuuhacraft@gmail.com','1234567','44214651863','ahaggdvec',NULL,1),(6,'Jadiel Santos','kuuhacraft@gmail.com','testeemail','65793874652','começou na grécia',NULL,1),(7,'Isabela Soares','isavilassoares@gmail.com','654321','40028922','a historia da isa eh maneira',NULL,0);
/*!40000 ALTER TABLE `pessoa_beneficiaria` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-16 19:47:56

CREATE DATABASE  IF NOT EXISTS `Beneficiarios` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `Beneficiarios`;
-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: gateway01.us-west-2.prod.aws.tidbcloud.com    Database: Beneficiarios
-- ------------------------------------------------------
-- Server version	5.7.28-TiDB-Serverless

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
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `namedonor` varchar(255) NOT NULL,
  `emaildonor` varchar(100) NOT NULL,
  `passworddonor` blob NOT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=750003;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doador`
--

LOCK TABLES `doador` WRITE;
/*!40000 ALTER TABLE `doador` DISABLE KEYS */;
INSERT INTO `doador` VALUES (720003,'Leonardo Marcos','leo.marcos6440@gmail.com',_binary '��ܯ�3\�#�U���@ߖ');
/*!40000 ALTER TABLE `doador` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `instituicao_beneficiaria`
--

DROP TABLE IF EXISTS `instituicao_beneficiaria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `instituicao_beneficiaria` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nameInc` varchar(255) COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `emailInc` varchar(255) COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `cnpjInc` varchar(20) COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `locationInc` varchar(255) COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `verificada` tinyint(1) DEFAULT NULL,
  `telInc` varchar(15) NOT NULL DEFAULT 'Não Informado',
  `passwordInc` blob DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=360011;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `instituicao_beneficiaria`
--

LOCK TABLES `instituicao_beneficiaria` WRITE;
/*!40000 ALTER TABLE `instituicao_beneficiaria` DISABLE KEYS */;
INSERT INTO `instituicao_beneficiaria` VALUES (300011,'Instituto Sidarta','leo.marcos6440@gmail.com','02111345000148','Rua Gaivota, 16, Chácara Vitapolis, Itapevi, SP',1,'(11) 99460-8491',NULL),(330013,'Leozinho do Corre','kuuhacraft@gmail.com','72834278347862','Avenida Paulista, 1001 - Jardins, São Paulo - SP',1,'(11) 92931-2938',_binary '\�\�\�A`��wI�[!���');
/*!40000 ALTER TABLE `instituicao_beneficiaria` ENABLE KEYS */;
UNLOCK TABLES;

--

DROP TABLE IF EXISTS `pessoa_beneficiaria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pessoa_beneficiaria` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `namePer` varchar(255) COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `emailPer` varchar(255) COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `verificado` tinyint(1) DEFAULT NULL,
  `telPer` varchar(15) NOT NULL DEFAULT 'Não informado',
  `passwordPer` blob NOT NULL,
  `cpfPer` blob NOT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=750002;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pessoa_beneficiaria`
--

LOCK TABLES `pessoa_beneficiaria` WRITE;
/*!40000 ALTER TABLE `pessoa_beneficiaria` DISABLE KEYS */;
INSERT INTO `pessoa_beneficiaria` VALUES (720003,'Leonardo de Souza','leo.marcos6440@gmail.com',1,'(11) 98298-9898',_binary '��ܯ�3\�#�U���@ߖ',_binary '�T���\�L�,�\�s.\�');
/*!40000 ALTER TABLE `pessoa_beneficiaria` ENABLE KEYS */;
UNLOCK TABLES;
-- Table structure for table `pedidos`
--

DROP TABLE IF EXISTS `pedidos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedidos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name_item` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `quantity_item` int(11) NOT NULL,
  `category` varchar(255) NOT NULL,
  `status` enum('Aberto','Pendente','Concluído','Cancelado') DEFAULT NULL,
  `urgencia_enum` enum('Baixa','Média','Alta','Urgente') NOT NULL,
  `locate` varchar(255) NOT NULL,
  `opened_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `pessoa_beneficiaria_id` int(11) DEFAULT NULL,
  `instituicao_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  KEY `pessoa_beneficiaria_id` (`pessoa_beneficiaria_id`),
  KEY `instituicao_id` (`instituicao_id`),
  CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`pessoa_beneficiaria_id`) REFERENCES `Beneficiarios`.`pessoa_beneficiaria` (`id`),
  CONSTRAINT `pedidos_ibfk_2` FOREIGN KEY (`instituicao_id`) REFERENCES `Beneficiarios`.`instituicao_beneficiaria` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=750007;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedidos`
--

LOCK TABLES `pedidos` WRITE;
/*!40000 ALTER TABLE `pedidos` DISABLE KEYS */;
/*!40000 ALTER TABLE `pedidos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pessoa_beneficiaria`
--


/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-05 13:57:49

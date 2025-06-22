CREATE DATABASE  IF NOT EXISTS `Beneficiarios`
USE `Beneficiarios`;

DROP TABLE IF EXISTS `doador`;
CREATE TABLE `doador` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `namedonor` varchar(255) NOT NULL,
  `emaildonor` varchar(100) NOT NULL,
  `passworddonor` blob NOT NULL,
  PRIMARY KEY (`id`) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=750003;
LOCK TABLES `doador` WRITE;
INSERT INTO `doador` VALUES (720003,'Leonardo Marcos','leo.marcos6440@gmail.com',_binary '��ܯ�3\�#�U���@ߖ');
UNLOCK TABLES;

DROP TABLE IF EXISTS `instituicao_beneficiaria`;
CREATE TABLE `instituicao_beneficiaria` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nameInc` varchar(255) COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `emailInc` varchar(255) COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `cnpjInc` varchar(20) COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `locationInc` varchar(255) COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `verificada` tinyint(1) DEFAULT NULL,
  `telInc` varchar(15) NOT NULL DEFAULT 'Não Informado',
  `passwordInc` blob DEFAULT NULL,
  PRIMARY KEY (`id`) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=360011;
LOCK TABLES `instituicao_beneficiaria` WRITE;
INSERT INTO `instituicao_beneficiaria` VALUES (300011,'Instituto Sidarta','leo.marcos6440@gmail.com','02111345000148','Rua Gaivota, 16, Chácara Vitapolis, Itapevi, SP',1,'(11) 99460-8491',NULL),(330013,'Leozinho do Corre','kuuhacraft@gmail.com','72834278347862','Avenida Paulista, 1001 - Jardins, São Paulo - SP',1,'(11) 92931-2938',_binary '\�\�\�A`��wI�[!���');
UNLOCK TABLES;
DROP TABLE IF EXISTS `pessoa_beneficiaria`;
CREATE TABLE `pessoa_beneficiaria` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `namePer` varchar(255) COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `emailPer` varchar(255) COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `verificado` tinyint(1) DEFAULT NULL,
  `telPer` varchar(15) NOT NULL DEFAULT 'Não informado',
  `passwordPer` blob NOT NULL,
  `cpfPer` blob NOT NULL,
  PRIMARY KEY (`id`) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=750002;
LOCK TABLES `pessoa_beneficiaria` WRITE;
INSERT INTO `pessoa_beneficiaria` VALUES (720003,'Leonardo de Souza','leo.marcos6440@gmail.com',1,'(11) 98298-9898',_binary '��ܯ�3\�#�U���@ߖ',_binary '�T���\�L�,�\�s.\�');
UNLOCK TABLES;
DROP TABLE IF EXISTS `pedidos`;
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
  PRIMARY KEY (`id`),
  KEY `pessoa_beneficiaria_id` (`pessoa_beneficiaria_id`),
  KEY `instituicao_id` (`instituicao_id`),
  CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`pessoa_beneficiaria_id`) REFERENCES `Beneficiarios`.`pessoa_beneficiaria` (`id`),
  CONSTRAINT `pedidos_ibfk_2` FOREIGN KEY (`instituicao_id`) REFERENCES `Beneficiarios`.`instituicao_beneficiaria` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=750007;
LOCK TABLES `pedidos` WRITE;
UNLOCK TABLES;
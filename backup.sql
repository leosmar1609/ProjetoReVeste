CREATE DATABASE IF NOT EXISTS `Beneficiarios`;
USE `Beneficiarios`;

DROP TABLE IF EXISTS `doador`;

CREATE TABLE `doador` (
  `id` int NOT NULL AUTO_INCREMENT,
  `namedonor` varchar(255) NOT NULL,
  `emaildonor` varchar(100) NOT NULL,
  `passworddonor` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ;

LOCK TABLES `doador` WRITE;

INSERT INTO `doador` VALUES (2,'Davi itner','itnerdavi10@gmail.com','Isameuamor123');

UNLOCK TABLES;

DROP TABLE IF EXISTS `instituicao_beneficiaria`;

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
) ;

LOCK TABLES `instituicao_beneficiaria` WRITE;
INSERT INTO `instituicao_beneficiaria` VALUES (10,'TesteINC','leo.marcos6440@gmail.com','testeemail','77894888333','rua charmelion, 15','hist e bem legal',0);

UNLOCK TABLES;

DROP TABLE IF EXISTS `pessoa_beneficiaria`;

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
) ;

LOCK TABLES `pessoa_beneficiaria` WRITE;

INSERT INTO `pessoa_beneficiaria` VALUES (1,'Leonardo','leops@gmail.com','1234567','44214651863','ahaggdvec',NULL,1),(7,'Isabela Soares','isavilassoares@gmail.com','654321','40028922','a historia da isa eh maneira',NULL,0);

UNLOCK TABLES;


DROP TABLE IF EXISTS `pedidos`;

CREATE TABLE `pedidos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name_item` varchar(255) DEFAULT NULL,
  `description` text,
  `quantity_item` int NOT NULL,
  `category` varchar(255) NOT NULL,
  `status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'Aberto',
  `urgencia_enum` enum('Baixa','M├®dia','Alta','Urgente') NOT NULL,
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
  CONSTRAINT `pedidos_chk_1` CHECK ((`category` in (_utf8mb4'roupas',_utf8mb4'alimentos',_utf8mb4'm├│veis',_utf8mb4'eletr├┤nicos',_utf8mb4'brinquedos'))),
  CONSTRAINT `pedidos_chk_2` CHECK ((`status` in (_utf8mb4'Aberto',_utf8mb4'Fechado',_utf8mb4'Pendente', _utf8mb4'Cancelado')))
) ;


LOCK TABLES `pedidos` WRITE;

INSERT INTO `pedidos` VALUES (6,'Salgadinho','teste isa',3,'alimentos','Fechado','Urgente','Rua Gaivota, 16','2025-04-17 22:57:32','2025-04-23 23:55:43',1,NULL),(7,'Parmegiana','Muito bom',2,'alimentos','Fechado','M├®dia','Rua dos Boror├│s, 131','2025-04-17 23:16:55','2025-05-12 22:57:34',1,NULL),(8,'Moletom','Super Quentinho',1,'roupas','Fechado','Baixa','Rua higien├│polis, 10 - S├úo Paulo','2025-04-17 23:17:43','2025-05-12 23:01:12',1,NULL),(9,'Guarda-roupas','Grande e novo',1,'m├│veis','Fechado','Urgente','Rua Campo Belo, 23 - Itapevi','2025-04-17 23:18:30','2025-05-12 23:01:18',1,NULL),(10,'Trem de Brinquedo','Se move com controle',2,'brinquedos','Fechado','M├®dia','Rua Rato, 66 - Barueri - SP','2025-04-17 23:19:31','2025-05-12 23:01:23',1,NULL),(14,'Celular','quakquer celular',1,'eletr├┤nicos','Fechado','M├®dia','Rua Jaguar├®, 777666 - santos - SP','2025-04-18 03:52:51','2025-05-12 23:01:27',1,NULL),(15,'Computador','Testessss',2,'eletr├┤nicos','Fechado','Alta','Rua Gaivota, 16 - Ch├ícara VIt├ípolis - Itapevi - SP','2025-05-12 23:05:17','2025-05-12 23:06:47',NULL,10),(16,'Computador','jasnkjnj',2,'eletr├┤nicos','Fechado','Baixa','Rua Gaivota, 16 - Ch├ícara VIt├ípolis - Itapevi - SP','2025-05-12 23:12:38','2025-05-12 23:13:24',NULL,10);

UNLOCK TABLES;

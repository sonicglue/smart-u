-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: localhost    Database: SystemAx
-- ------------------------------------------------------
-- Server version	5.7.19-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `AccessToken`
--

DROP TABLE IF EXISTS `AccessToken`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `AccessToken` (
  `id` varchar(255) NOT NULL,
  `ttl` int(11) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `userId` varchar(512) DEFAULT NULL,
  `scopes` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AccessToken`
--

LOCK TABLES `AccessToken` WRITE;
/*!40000 ALTER TABLE `AccessToken` DISABLE KEYS */;
INSERT INTO `AccessToken` VALUES ('9VWR6GyYgTDRisZl1oSw37b1Xg00Q88glqh9ozBiGBG8X6q4YhUnUPJVPF9G18gH',1209600,'2019-01-11 00:50:04','c9f2db10-136d-11e9-bea1-5b35f2aa1f82',NULL),('cSnTZUxsMkB7vfekBJQaZ8BYi4Mzlu3s7XA5DzeCJVr44ivRn3xBaKXFCqFdy7Wy',1209600,'2019-01-11 00:50:06','c9f2db10-136d-11e9-bea1-5b35f2aa1f82',NULL),('dLImELYJH2bkhGgo2gB2L1OXImSgzl7uxvvALCVrQiWkK6GlMC8OXMFrG3BVF5G6',1209600,'2019-01-11 00:57:10','c9f2db10-136d-11e9-bea1-5b35f2aa1f82',NULL),('JpF1t6TUzLPsd6gqpUnu60HEkCOMBqivOOcidpIHNguj9o3rNrUebgA6zaQihOCb',1209600,'2019-01-15 22:51:00','d9142060-137f-11e9-93bf-1b522a6f7761',NULL),('uoQ8xJhvlN4ytKB106yuWhbW2InJhdCWskDRXO3uPZEkcDpSFQLNbmAo7pAbvT0v',1209600,'2019-01-14 23:55:48','e24bf180-1857-11e9-aa52-01bf601a2b94',NULL);
/*!40000 ALTER TABLE `AccessToken` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Accessory`
--

DROP TABLE IF EXISTS `Accessory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Accessory` (
  `id` char(36) NOT NULL,
  `idProductType` char(36) NOT NULL,
  `name` varchar(45) NOT NULL,
  `tag` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `type_accessory_idx` (`idProductType`),
  CONSTRAINT `type_accessory` FOREIGN KEY (`idProductType`) REFERENCES `ProductType` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Accessory`
--

LOCK TABLES `Accessory` WRITE;
/*!40000 ALTER TABLE `Accessory` DISABLE KEYS */;
INSERT INTO `Accessory` VALUES ('6bc5df90-1824-11e9-9b6f-992b26935844','073e1ca0-b5d6-11e8-a22e-3f02da1bc6c3','USB','usb'),('757f3130-1824-11e9-9b6f-992b26935844','073e1ca0-b5d6-11e8-a22e-3f02da1bc6c3','Tapa','tapa'),('919fa980-1824-11e9-9b6f-992b26935844','073e1ca0-b5d6-11e8-a22e-3f02da1bc6c3','Batería','bateria'),('a01c76a0-1824-11e9-9b6f-992b26935844','073e1ca0-b5d6-11e8-a22e-3f02da1bc6c3','Sim Card','sim-card'),('a9064340-1824-11e9-9b6f-992b26935844','073e1ca0-b5d6-11e8-a22e-3f02da1bc6c3','Adaptador','adaptador'),('ba73c7b0-1824-11e9-9b6f-992b26935844','073e1ca0-b5d6-11e8-a22e-3f02da1bc6c3','Memoria','memoria'),('c4060950-1824-11e9-9b6f-992b26935844','073e1ca0-b5d6-11e8-a22e-3f02da1bc6c3','Manuales','manuales'),('cd795140-1824-11e9-9b6f-992b26935844','073e1ca0-b5d6-11e8-a22e-3f02da1bc6c3','Cargador','cargador'),('d5415a30-1824-11e9-9b6f-992b26935844','073e1ca0-b5d6-11e8-a22e-3f02da1bc6c3','Manos libres','manos-libres'),('e0a2b680-1824-11e9-9b6f-992b26935844','073e1ca0-b5d6-11e8-a22e-3f02da1bc6c3','Caja','caja');
/*!40000 ALTER TABLE `Accessory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Assignment`
--

DROP TABLE IF EXISTS `Assignment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Assignment` (
  `id` char(36) NOT NULL,
  `idOrigin` char(36) NOT NULL,
  `idDestiny` char(36) NOT NULL,
  `number` varchar(45) NOT NULL,
  `idSender` char(36) NOT NULL,
  `idReceiver` char(36) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'open',
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `received` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `origin_assignment_idx` (`idOrigin`),
  KEY `destiny_assignment_idx` (`idDestiny`),
  KEY `sender_assignment_idx` (`idSender`),
  KEY `receiver_assignment_idx` (`idReceiver`),
  CONSTRAINT `destiny_assignment` FOREIGN KEY (`idDestiny`) REFERENCES `Warehouse` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `origin_assignment` FOREIGN KEY (`idOrigin`) REFERENCES `Warehouse` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `receiver_assignment` FOREIGN KEY (`idReceiver`) REFERENCES `SysUser` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `sender_assignment` FOREIGN KEY (`idSender`) REFERENCES `SysUser` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Assignment`
--

LOCK TABLES `Assignment` WRITE;
/*!40000 ALTER TABLE `Assignment` DISABLE KEYS */;
INSERT INTO `Assignment` VALUES ('570a0690-183c-11e9-a70b-e1d3c1cd98df','c9e0b2a0-136d-11e9-bea1-5b35f2aa1f82','79914320-13a7-11e9-98f3-6963032782d8','20190114001','c9f2db10-136d-11e9-bea1-5b35f2aa1f82','d9142060-137f-11e9-93bf-1b522a6f7761','received','2019-01-14 20:38:24','2019-01-14 23:39:52'),('d373f6f0-1855-11e9-aa52-01bf601a2b94','79914320-13a7-11e9-98f3-6963032782d8','4b301ee0-183c-11e9-a70b-e1d3c1cd98df','20190114002','d9142060-137f-11e9-93bf-1b522a6f7761','d9142060-137f-11e9-93bf-1b522a6f7761','received','2019-01-14 23:40:51','2019-01-14 23:41:24');
/*!40000 ALTER TABLE `Assignment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AssignmentHasStock`
--

DROP TABLE IF EXISTS `AssignmentHasStock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `AssignmentHasStock` (
  `id` char(36) NOT NULL,
  `idAssignment` char(36) NOT NULL,
  `idStock` char(36) NOT NULL,
  `validate` tinyint(4) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `sheet_assigment_idx` (`idAssignment`),
  KEY `stock_this_idx` (`idStock`),
  CONSTRAINT `assignment_this` FOREIGN KEY (`idAssignment`) REFERENCES `Assignment` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `stock_this` FOREIGN KEY (`idStock`) REFERENCES `Stock` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AssignmentHasStock`
--

LOCK TABLES `AssignmentHasStock` WRITE;
/*!40000 ALTER TABLE `AssignmentHasStock` DISABLE KEYS */;
INSERT INTO `AssignmentHasStock` VALUES ('e29a9aa0-183f-11e9-a70b-e1d3c1cd98df','570a0690-183c-11e9-a70b-e1d3c1cd98df','1a8ccbd0-183c-11e9-a70b-e1d3c1cd98df',0),('e32ec450-183f-11e9-a70b-e1d3c1cd98df','570a0690-183c-11e9-a70b-e1d3c1cd98df','1b66ff30-183c-11e9-a70b-e1d3c1cd98df',0),('e3fa0190-1855-11e9-aa52-01bf601a2b94','d373f6f0-1855-11e9-aa52-01bf601a2b94','1a8ccbd0-183c-11e9-a70b-e1d3c1cd98df',0),('e4dd37a0-183f-11e9-a70b-e1d3c1cd98df','570a0690-183c-11e9-a70b-e1d3c1cd98df','1bb6cce0-183c-11e9-a70b-e1d3c1cd98df',0),('e55b6650-1855-11e9-aa52-01bf601a2b94','d373f6f0-1855-11e9-aa52-01bf601a2b94','1b66ff30-183c-11e9-a70b-e1d3c1cd98df',0);
/*!40000 ALTER TABLE `AssignmentHasStock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Batch`
--

DROP TABLE IF EXISTS `Batch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Batch` (
  `id` char(36) NOT NULL,
  `idPurchaseOrder` char(36) DEFAULT NULL,
  `idProduct` char(36) NOT NULL,
  `date` datetime DEFAULT CURRENT_TIMESTAMP,
  `stockSize` int(11) NOT NULL,
  `cost` decimal(8,2) NOT NULL DEFAULT '0.00',
  `providerSupport` decimal(8,2) DEFAULT '0.00',
  `brandSupport` decimal(8,2) DEFAULT '0.00',
  `additionalSupport` decimal(8,2) DEFAULT '0.00',
  `isPrepaid` tinyint(4) DEFAULT '0',
  `boxSize` smallint(6) unsigned DEFAULT '10',
  PRIMARY KEY (`id`),
  UNIQUE KEY `BATCH_UNIQUE` (`id`,`idPurchaseOrder`,`idProduct`),
  KEY `product_batch_idx` (`idProduct`),
  KEY `purchase_batch_idx` (`idPurchaseOrder`),
  CONSTRAINT `product_batch` FOREIGN KEY (`idProduct`) REFERENCES `Product` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `purchase_batch` FOREIGN KEY (`idPurchaseOrder`) REFERENCES `PurchaseOrder` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Batch`
--

LOCK TABLES `Batch` WRITE;
/*!40000 ALTER TABLE `Batch` DISABLE KEYS */;
INSERT INTO `Batch` VALUES ('218adff0-183a-11e9-a70b-e1d3c1cd98df',NULL,'21895950-183a-11e9-a70b-e1d3c1cd98df','2019-01-14 14:22:36',999,1.00,0.00,0.00,0.00,0,10);
/*!40000 ALTER TABLE `Batch` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Billing`
--

DROP TABLE IF EXISTS `Billing`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Billing` (
  `id` char(36) NOT NULL,
  `rfc` char(13) DEFAULT NULL,
  `type` varchar(45) DEFAULT NULL,
  `class` varchar(45) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `street` varchar(100) DEFAULT NULL,
  `extNumber` varchar(20) DEFAULT NULL,
  `intNumber` varchar(20) DEFAULT NULL,
  `zipcode` char(5) DEFAULT NULL,
  `colony` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `municipality` varchar(100) DEFAULT NULL,
  `state` varchar(50) DEFAULT NULL,
  `country` varchar(50) DEFAULT NULL,
  `phoneNumber` char(13) DEFAULT NULL,
  `mobileNumber` char(13) DEFAULT NULL,
  `discount` smallint(5) unsigned DEFAULT '0',
  `email` varchar(100) DEFAULT NULL,
  `reference` varchar(100) DEFAULT NULL,
  `maxCredit` decimal(8,2) DEFAULT '0.00',
  `debt` decimal(8,2) DEFAULT '0.00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Billing`
--

LOCK TABLES `Billing` WRITE;
/*!40000 ALTER TABLE `Billing` DISABLE KEYS */;
INSERT INTO `Billing` VALUES ('1fc47f70-fcbd-11e8-9999-696167e4f583',NULL,'fisica','company','AX Comunicaciones, S.A. de C.V.',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'México','1234567890',NULL,0,'contacto@axcomunicacion.com',NULL,0.00,0.00),('2fb85190-185b-11e9-854d-6d5d71b35990',NULL,'fisica','client','Enrique Sotelo Ponce',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'México','5510828038',NULL,0,'sotelo.enrique@gmail.com',NULL,0.00,0.00),('34cb0920-fcbd-11e8-9999-696167e4f583',NULL,'fisica','provider','Martín Mejía',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'México','9876543210',NULL,0,'martin@multiplicame.com',NULL,0.00,0.00),('dc4dbad0-ec5f-11e8-9fca-7791a022412d',NULL,'fisica','company','MadMedia Advertising, S.A. de C.V.',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'México','1234567890',NULL,0,'contacto@madmedia.com',NULL,0.00,0.00),('e1318f90-ec5f-11e8-9fca-7791a022412d','IUS890616RH6','moral','provider','AT&T Comercialización Móvil, S. de R.L. de C.V.','Rio Lerma','232','Piso 20','06500',NULL,'Ciudad de México',NULL,NULL,'México','55666548',NULL,0,'contacto@att.com','Edificio de AT&T',0.00,0.00);
/*!40000 ALTER TABLE `Billing` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Brand`
--

DROP TABLE IF EXISTS `Brand`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Brand` (
  `id` char(36) NOT NULL,
  `name` varchar(45) NOT NULL,
  `tag` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Brand`
--

LOCK TABLES `Brand` WRITE;
/*!40000 ALTER TABLE `Brand` DISABLE KEYS */;
INSERT INTO `Brand` VALUES ('0893aab0-0d2f-11e9-8708-bd30568592dd','Xiaomi','xiaomi'),('f0eba990-ec5d-11e8-9fca-7791a022412d','Sony','sony'),('f6652260-c670-11e8-a469-8596b1acfbf3','AT&T','att'),('f8a5f860-b55e-11e8-a22e-3f02da1bc6c3','W&O','wo');
/*!40000 ALTER TABLE `Brand` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Color`
--

DROP TABLE IF EXISTS `Color`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Color` (
  `id` char(36) NOT NULL,
  `name` varchar(45) NOT NULL,
  `tag` varchar(10) NOT NULL,
  `index` smallint(5) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Color`
--

LOCK TABLES `Color` WRITE;
/*!40000 ALTER TABLE `Color` DISABLE KEYS */;
INSERT INTO `Color` VALUES ('3cda4930-c5d3-11e8-a892-b1d151a2612c','Rosa','rosa',6),('4b639970-c5d3-11e8-a892-b1d151a2612c','Morado','morado',14),('553f6730-c5d3-11e8-a892-b1d151a2612c','Purpura','purpura',7),('5b95b7b0-c5d3-11e8-a892-b1d151a2612c','Rojo','rojo',8),('6d6f87f0-c5d2-11e8-a892-b1d151a2612c','Sin color','sin-color',0),('76db8770-c5d3-11e8-a892-b1d151a2612c','Azul','azul',9),('7ca109a0-c5d3-11e8-a892-b1d151a2612c','Verde','verde',10),('85dec2a0-c5d3-11e8-a892-b1d151a2612c','Naranja','naranja',11),('8d722700-c5d3-11e8-a892-b1d151a2612c','Amarillo','amarillo',12),('943988d0-c5d3-11e8-a892-b1d151a2612c','Café','cafe',13),('aafc3270-b561-11e8-a22e-3f02da1bc6c3','Negro','negro',1),('b360c980-b561-11e8-a22e-3f02da1bc6c3','Blanco','blanco',2),('ba142e20-b561-11e8-a22e-3f02da1bc6c3','Gris','gris',5),('bf547ac0-b561-11e8-a22e-3f02da1bc6c3','Oro','oro',3),('c5d25070-b561-11e8-a22e-3f02da1bc6c3','Plata','plata',4),('ed1c6b70-e441-11e8-b366-45fec3972aee','Índigo','indigo',15);
/*!40000 ALTER TABLE `Color` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Failure`
--

DROP TABLE IF EXISTS `Failure`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Failure` (
  `id` char(36) NOT NULL,
  `idProductType` char(36) NOT NULL,
  `name` varchar(45) NOT NULL,
  `tag` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `type_failure_idx` (`idProductType`),
  CONSTRAINT `type_failure` FOREIGN KEY (`idProductType`) REFERENCES `ProductType` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Failure`
--

LOCK TABLES `Failure` WRITE;
/*!40000 ALTER TABLE `Failure` DISABLE KEYS */;
INSERT INTO `Failure` VALUES ('003cef70-1829-11e9-a70b-e1d3c1cd98df','073e1ca0-b5d6-11e8-a22e-3f02da1bc6c3','Touch','touch'),('08006480-1829-11e9-a70b-e1d3c1cd98df','073e1ca0-b5d6-11e8-a22e-3f02da1bc6c3','Display','display'),('0bb0d770-182b-11e9-a70b-e1d3c1cd98df','073e1ca0-b5d6-11e8-a22e-3f02da1bc6c3','Bocina dañada','bocina-danada'),('11345980-1829-11e9-a70b-e1d3c1cd98df','073e1ca0-b5d6-11e8-a22e-3f02da1bc6c3','Pin dañado','pin-danado'),('1ab9c9e0-1829-11e9-a70b-e1d3c1cd98df','073e1ca0-b5d6-11e8-a22e-3f02da1bc6c3','Se calienta','se-calienta'),('2c175de0-182b-11e9-a70b-e1d3c1cd98df','073e1ca0-b5d6-11e8-a22e-3f02da1bc6c3','Micrófono dañado','microfono-danado'),('3e13b4d0-182b-11e9-a70b-e1d3c1cd98df','073e1ca0-b5d6-11e8-a22e-3f02da1bc6c3','Pila','pila'),('678b5b70-182a-11e9-a70b-e1d3c1cd98df','073e1ca0-b5d6-11e8-a22e-3f02da1bc6c3','Se pasma','se-pasma'),('738d1670-182a-11e9-a70b-e1d3c1cd98df','073e1ca0-b5d6-11e8-a22e-3f02da1bc6c3','Se reinicia','se-reinicia'),('a318b7f0-182a-11e9-a70b-e1d3c1cd98df','073e1ca0-b5d6-11e8-a22e-3f02da1bc6c3','No lee chip','no-lee-chip'),('ab24f5d0-182a-11e9-a70b-e1d3c1cd98df','073e1ca0-b5d6-11e8-a22e-3f02da1bc6c3','No lee SD','no-lee-sd'),('ba145ae0-182a-11e9-a70b-e1d3c1cd98df','073e1ca0-b5d6-11e8-a22e-3f02da1bc6c3','No conecta datos','no-conecta-datos'),('c4b414e0-182a-11e9-a70b-e1d3c1cd98df','073e1ca0-b5d6-11e8-a22e-3f02da1bc6c3','Bloqueado','bloqueado'),('d1937090-1828-11e9-a70b-e1d3c1cd98df','073e1ca0-b5d6-11e8-a22e-3f02da1bc6c3','Teclado dañado','teclado-danado'),('d26d43e0-182a-11e9-a70b-e1d3c1cd98df','073e1ca0-b5d6-11e8-a22e-3f02da1bc6c3','Auricular dañado','auricular-danado'),('dd8c51f0-1828-11e9-a70b-e1d3c1cd98df','073e1ca0-b5d6-11e8-a22e-3f02da1bc6c3','Software','software'),('e7ec91f0-1828-11e9-a70b-e1d3c1cd98df','073e1ca0-b5d6-11e8-a22e-3f02da1bc6c3','No prende','no-prende'),('efd457e0-1828-11e9-a70b-e1d3c1cd98df','073e1ca0-b5d6-11e8-a22e-3f02da1bc6c3','No carga','no-carga'),('f35b70e0-182a-11e9-a70b-e1d3c1cd98df','073e1ca0-b5d6-11e8-a22e-3f02da1bc6c3','No conecta Wi-Fi','no-conecta-wi-fi'),('f82b8170-1828-11e9-a70b-e1d3c1cd98df','073e1ca0-b5d6-11e8-a22e-3f02da1bc6c3','Camara','camara'),('ffe101e0-182a-11e9-a70b-e1d3c1cd98df','073e1ca0-b5d6-11e8-a22e-3f02da1bc6c3','Sin señal','sin-senal');
/*!40000 ALTER TABLE `Failure` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Guarantee`
--

DROP TABLE IF EXISTS `Guarantee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Guarantee` (
  `id` char(36) NOT NULL,
  `idStock` char(36) NOT NULL,
  `idUser` char(36) NOT NULL,
  `idWarehouse` char(36) NOT NULL,
  `idClient` char(36) DEFAULT NULL,
  `guideNumber` varchar(45) NOT NULL,
  `status` varchar(45) DEFAULT 'open',
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `hasCost` tinyint(4) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `stock_guarantee_idx` (`idStock`),
  KEY `seller_guarantee_idx` (`idUser`),
  KEY `warehouse_guarantee_idx` (`idWarehouse`),
  KEY `client_guarantee_idx` (`idClient`),
  CONSTRAINT `client_guarantee` FOREIGN KEY (`idClient`) REFERENCES `Billing` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `seller_guarantee` FOREIGN KEY (`idUser`) REFERENCES `SysUser` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `stock_guarantee` FOREIGN KEY (`idStock`) REFERENCES `Stock` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `warehouse_guarantee` FOREIGN KEY (`idWarehouse`) REFERENCES `Warehouse` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Guarantee`
--

LOCK TABLES `Guarantee` WRITE;
/*!40000 ALTER TABLE `Guarantee` DISABLE KEYS */;
INSERT INTO `Guarantee` VALUES ('a2a58c80-1866-11e9-abf6-333034df22b8','1a8ccbd0-183c-11e9-a70b-e1d3c1cd98df','e24bf180-1857-11e9-aa52-01bf601a2b94','4b301ee0-183c-11e9-a70b-e1d3c1cd98df','2fb85190-185b-11e9-854d-6d5d71b35990','20190114001','open','2019-01-14 19:41:10',0);
/*!40000 ALTER TABLE `Guarantee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `GuaranteeHasAccessory`
--

DROP TABLE IF EXISTS `GuaranteeHasAccessory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `GuaranteeHasAccessory` (
  `id` char(36) NOT NULL,
  `idGuarantee` char(36) NOT NULL,
  `idProduct` char(36) NOT NULL,
  `idAccessory` char(36) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `guarantee_this_idx` (`idGuarantee`),
  KEY `product_thisGuarantee_idx` (`idProduct`),
  KEY `accessory_thisGuarantee_idx` (`idAccessory`),
  CONSTRAINT `accessory_thisGuarantee` FOREIGN KEY (`idAccessory`) REFERENCES `ProductHasAccessory` (`idProduct`) ON UPDATE CASCADE,
  CONSTRAINT `guarantee_this` FOREIGN KEY (`idGuarantee`) REFERENCES `Guarantee` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `product_thisGuarantee` FOREIGN KEY (`idProduct`) REFERENCES `ProductHasAccessory` (`idProduct`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `GuaranteeHasAccessory`
--

LOCK TABLES `GuaranteeHasAccessory` WRITE;
/*!40000 ALTER TABLE `GuaranteeHasAccessory` DISABLE KEYS */;
/*!40000 ALTER TABLE `GuaranteeHasAccessory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `GuaranteeHasFailure`
--

DROP TABLE IF EXISTS `GuaranteeHasFailure`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `GuaranteeHasFailure` (
  `id` char(36) NOT NULL,
  `idGuarantee` char(36) NOT NULL,
  `idProduct` char(36) NOT NULL,
  `idFailure` char(36) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `failure_thisGuarantee_idx` (`idFailure`),
  KEY `guarantee_thisFailure_idx` (`idGuarantee`),
  KEY `product_thisFailure_idx` (`idProduct`),
  CONSTRAINT `failure_thisGuarantee` FOREIGN KEY (`idFailure`) REFERENCES `Failure` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `guarantee_thisFailure` FOREIGN KEY (`idGuarantee`) REFERENCES `Guarantee` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `product_thisFailure` FOREIGN KEY (`idProduct`) REFERENCES `Product` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `GuaranteeHasFailure`
--

LOCK TABLES `GuaranteeHasFailure` WRITE;
/*!40000 ALTER TABLE `GuaranteeHasFailure` DISABLE KEYS */;
/*!40000 ALTER TABLE `GuaranteeHasFailure` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `GuaranteeLog`
--

DROP TABLE IF EXISTS `GuaranteeLog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `GuaranteeLog` (
  `id` char(36) NOT NULL,
  `idGuarantee` char(36) NOT NULL,
  `date` datetime DEFAULT CURRENT_TIMESTAMP,
  `event` varchar(45) NOT NULL,
  `description` varchar(200) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `guarantee_log_idx` (`idGuarantee`),
  CONSTRAINT `guarantee_log` FOREIGN KEY (`idGuarantee`) REFERENCES `Guarantee` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `GuaranteeLog`
--

LOCK TABLES `GuaranteeLog` WRITE;
/*!40000 ALTER TABLE `GuaranteeLog` DISABLE KEYS */;
INSERT INTO `GuaranteeLog` VALUES ('a2a84ba0-1866-11e9-abf6-333034df22b8','a2a58c80-1866-11e9-abf6-333034df22b8','2019-01-14 19:41:10','create','Registro de garantía.');
/*!40000 ALTER TABLE `GuaranteeLog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Invoice`
--

DROP TABLE IF EXISTS `Invoice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Invoice` (
  `id` char(36) NOT NULL,
  `idOrder` char(36) NOT NULL,
  `idClient` char(36) NOT NULL,
  `serie` varchar(45) NOT NULL,
  `folio` varchar(45) NOT NULL,
  `date` datetime NOT NULL,
  `currency` int(11) NOT NULL,
  `currencyExchange` int(11) NOT NULL,
  `reference` varchar(10) NOT NULL,
  `totalItems` int(10) unsigned NOT NULL,
  `cfdi` varchar(45) NOT NULL,
  `subtotal` decimal(8,2) NOT NULL,
  `discount` decimal(8,2) DEFAULT '0.00',
  `iva` decimal(8,2) NOT NULL,
  `total` decimal(8,2) NOT NULL,
  `billShipping` tinyint(4) DEFAULT '0',
  `paymentMethod` varchar(45) NOT NULL,
  `typePayment` varchar(45) NOT NULL,
  `paymentCondition` varchar(45) NOT NULL,
  `rfc` varchar(15) NOT NULL,
  `person` varchar(10) NOT NULL,
  `bussinessName` varchar(200) NOT NULL,
  `email` varchar(200) NOT NULL,
  `address` varchar(200) NOT NULL,
  `outNumber` varchar(45) NOT NULL,
  `inNumber` varchar(45) NOT NULL,
  `referenceAddress` varchar(200) NOT NULL,
  `colony` varchar(100) NOT NULL,
  `municipality` varchar(100) NOT NULL,
  `city` varchar(100) NOT NULL,
  `state` varchar(100) NOT NULL,
  `country` varchar(100) NOT NULL,
  `zipcode` varchar(5) NOT NULL,
  `status` varchar(20) NOT NULL,
  `url` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `client_invoice_idx` (`idClient`),
  KEY `order_invoice_idx` (`idOrder`),
  CONSTRAINT `client_invoice` FOREIGN KEY (`idClient`) REFERENCES `Billing` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `order_invoice` FOREIGN KEY (`idOrder`) REFERENCES `Order` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Invoice`
--

LOCK TABLES `Invoice` WRITE;
/*!40000 ALTER TABLE `Invoice` DISABLE KEYS */;
/*!40000 ALTER TABLE `Invoice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `InvoiceHasItem`
--

DROP TABLE IF EXISTS `InvoiceHasItem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `InvoiceHasItem` (
  `id` char(36) NOT NULL,
  `idInvoice` char(36) NOT NULL,
  `idProduct` char(36) NOT NULL,
  `index` int(10) unsigned NOT NULL,
  `unit` char(10) DEFAULT 'PZA',
  `quantity` int(10) unsigned NOT NULL,
  `currency` int(11) NOT NULL,
  `currencyExchange` int(11) NOT NULL,
  `price` decimal(8,2) NOT NULL,
  `neto` decimal(8,2) NOT NULL,
  `tax` decimal(8,2) NOT NULL,
  `discount` decimal(8,2) DEFAULT '0.00',
  `total` decimal(8,2) NOT NULL,
  `description` varchar(250) DEFAULT NULL,
  `satCode` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `invoice_invoiceItem_idx` (`idInvoice`),
  KEY `product_invoiceItem_idx` (`idProduct`),
  CONSTRAINT `invoice_invoiceItem` FOREIGN KEY (`idInvoice`) REFERENCES `Invoice` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `product_invoiceItem` FOREIGN KEY (`idProduct`) REFERENCES `Product` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `InvoiceHasItem`
--

LOCK TABLES `InvoiceHasItem` WRITE;
/*!40000 ALTER TABLE `InvoiceHasItem` DISABLE KEYS */;
/*!40000 ALTER TABLE `InvoiceHasItem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Order`
--

DROP TABLE IF EXISTS `Order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Order` (
  `id` char(36) NOT NULL,
  `idSeller` char(36) NOT NULL,
  `idClient` char(36) NOT NULL,
  `orderNumber` varchar(10) NOT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `totalItems` int(10) unsigned NOT NULL,
  `subtotal` decimal(8,2) NOT NULL,
  `discount` decimal(8,2) DEFAULT '0.00',
  `total` decimal(8,2) NOT NULL,
  `credit` decimal(8,2) NOT NULL,
  `cash` decimal(8,2) NOT NULL,
  `status` varchar(20) NOT NULL,
  `clientNotes` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `client_order_idx` (`idClient`),
  KEY `seller_order_idx` (`idSeller`),
  CONSTRAINT `client_order` FOREIGN KEY (`idClient`) REFERENCES `Billing` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `seller_order` FOREIGN KEY (`idSeller`) REFERENCES `SysUser` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Order`
--

LOCK TABLES `Order` WRITE;
/*!40000 ALTER TABLE `Order` DISABLE KEYS */;
/*!40000 ALTER TABLE `Order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `OrderHasProduct`
--

DROP TABLE IF EXISTS `OrderHasProduct`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `OrderHasProduct` (
  `id` char(36) NOT NULL,
  `idOrder` char(36) NOT NULL,
  `idProduct` char(36) NOT NULL,
  `totalItems` int(10) unsigned NOT NULL,
  `subtotal` decimal(8,2) NOT NULL,
  `discount` decimal(8,2) DEFAULT '0.00',
  `total` decimal(8,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_orderItem_idx` (`idOrder`),
  KEY `product_orderItem_idx` (`idProduct`),
  CONSTRAINT `order_orderItem` FOREIGN KEY (`idOrder`) REFERENCES `Order` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `product_orderItem` FOREIGN KEY (`idProduct`) REFERENCES `Product` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `OrderHasProduct`
--

LOCK TABLES `OrderHasProduct` WRITE;
/*!40000 ALTER TABLE `OrderHasProduct` DISABLE KEYS */;
/*!40000 ALTER TABLE `OrderHasProduct` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Payment`
--

DROP TABLE IF EXISTS `Payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Payment` (
  `id` char(36) NOT NULL,
  `idSeller` char(36) NOT NULL,
  `idClient` char(36) NOT NULL,
  `idOrder` char(36) DEFAULT NULL,
  `date` datetime DEFAULT CURRENT_TIMESTAMP,
  `previousDebt` decimal(8,2) NOT NULL,
  `cash` decimal(8,2) DEFAULT '0.00',
  `deposit` decimal(8,2) DEFAULT '0.00',
  `credit` decimal(8,2) DEFAULT '0.00',
  `discount` decimal(8,2) DEFAULT '0.00' COMMENT 'Bonificación al adeudo',
  `payment` decimal(8,2) DEFAULT '0.00' COMMENT 'Abono a su deuda anterior',
  `currentDebt` decimal(8,2) NOT NULL,
  `transactionId` varchar(45) DEFAULT NULL,
  `status` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `client_payment_idx` (`idClient`),
  KEY `order_payment_idx` (`idOrder`),
  KEY `seller_payment_idx` (`idSeller`),
  CONSTRAINT `client_payment` FOREIGN KEY (`idClient`) REFERENCES `Billing` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `order_payment` FOREIGN KEY (`idOrder`) REFERENCES `Order` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `seller_payment` FOREIGN KEY (`idSeller`) REFERENCES `SysUser` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Payment`
--

LOCK TABLES `Payment` WRITE;
/*!40000 ALTER TABLE `Payment` DISABLE KEYS */;
/*!40000 ALTER TABLE `Payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Product`
--

DROP TABLE IF EXISTS `Product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Product` (
  `id` char(36) NOT NULL,
  `idBrand` char(36) NOT NULL,
  `idProductModel` char(36) NOT NULL,
  `idColor` char(36) NOT NULL,
  `idProductType` char(36) NOT NULL,
  `idProductVariant` char(36) NOT NULL,
  `idVariantOption` char(36) NOT NULL,
  `name` varchar(45) NOT NULL,
  `serieLength` int(11) DEFAULT '15',
  PRIMARY KEY (`id`),
  KEY `color_product_idx` (`idColor`),
  KEY `model_product_idx` (`idProductModel`,`idBrand`),
  KEY `option_product_idx` (`idVariantOption`,`idProductVariant`,`idProductType`),
  CONSTRAINT `color_product` FOREIGN KEY (`idColor`) REFERENCES `Color` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `model_product` FOREIGN KEY (`idProductModel`, `idBrand`) REFERENCES `ProductModel` (`id`, `idBrand`) ON UPDATE CASCADE,
  CONSTRAINT `option_product` FOREIGN KEY (`idVariantOption`, `idProductVariant`, `idProductType`) REFERENCES `ProductVariantOption` (`id`, `idProductVariant`, `idProductType`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Product`
--

LOCK TABLES `Product` WRITE;
/*!40000 ALTER TABLE `Product` DISABLE KEYS */;
INSERT INTO `Product` VALUES ('12b3d470-0d2f-11e9-8708-bd30568592dd','0893aab0-0d2f-11e9-8708-bd30568592dd','0df67370-0d2f-11e9-8708-bd30568592dd','bf547ac0-b561-11e8-a22e-3f02da1bc6c3','073e1ca0-b5d6-11e8-a22e-3f02da1bc6c3','22e175b0-b5d6-11e8-a22e-3f02da1bc6c3','7689c7d0-b5d6-11e8-a22e-3f02da1bc6c3','Xiaomi M2, Oro 32 Gb',15),('21895950-183a-11e9-a70b-e1d3c1cd98df','f0eba990-ec5d-11e8-9fca-7791a022412d','b7acd3b0-0a27-11e9-93ce-6bdc9aa95e8f','aafc3270-b561-11e8-a22e-3f02da1bc6c3','073e1ca0-b5d6-11e8-a22e-3f02da1bc6c3','22e175b0-b5d6-11e8-a22e-3f02da1bc6c3','6fd52ab0-b5d6-11e8-a22e-3f02da1bc6c3','Sony Xperia XA1, Negro 16 Gb',15),('4d802ae0-0d2f-11e9-8708-bd30568592dd','f8a5f860-b55e-11e8-a22e-3f02da1bc6c3','0293dca0-b561-11e8-a22e-3f02da1bc6c3','bf547ac0-b561-11e8-a22e-3f02da1bc6c3','073e1ca0-b5d6-11e8-a22e-3f02da1bc6c3','22e175b0-b5d6-11e8-a22e-3f02da1bc6c3','7689c7d0-b5d6-11e8-a22e-3f02da1bc6c3','W&O Max 13, Oro 32 Gb',15),('5f611130-0a27-11e9-93ce-6bdc9aa95e8f','f8a5f860-b55e-11e8-a22e-3f02da1bc6c3','0293dca0-b561-11e8-a22e-3f02da1bc6c3','c5d25070-b561-11e8-a22e-3f02da1bc6c3','073e1ca0-b5d6-11e8-a22e-3f02da1bc6c3','22e175b0-b5d6-11e8-a22e-3f02da1bc6c3','6fd52ab0-b5d6-11e8-a22e-3f02da1bc6c3','W&O Max 13, Plata 16 Gb',15),('635f40e0-0a27-11e9-93ce-6bdc9aa95e8f','f8a5f860-b55e-11e8-a22e-3f02da1bc6c3','0293dca0-b561-11e8-a22e-3f02da1bc6c3','bf547ac0-b561-11e8-a22e-3f02da1bc6c3','073e1ca0-b5d6-11e8-a22e-3f02da1bc6c3','22e175b0-b5d6-11e8-a22e-3f02da1bc6c3','6fd52ab0-b5d6-11e8-a22e-3f02da1bc6c3','W&O Max 13, Oro 16 Gb',15),('71635d00-1366-11e9-a50d-17be207bb5c0','0893aab0-0d2f-11e9-8708-bd30568592dd','0df67370-0d2f-11e9-8708-bd30568592dd','85dec2a0-c5d3-11e8-a892-b1d151a2612c','073e1ca0-b5d6-11e8-a22e-3f02da1bc6c3','22e175b0-b5d6-11e8-a22e-3f02da1bc6c3','6fd52ab0-b5d6-11e8-a22e-3f02da1bc6c3','Xiaomi M2, Naranja 16 Gb',15),('be449a00-0a27-11e9-93ce-6bdc9aa95e8f','f0eba990-ec5d-11e8-9fca-7791a022412d','b7acd3b0-0a27-11e9-93ce-6bdc9aa95e8f','b360c980-b561-11e8-a22e-3f02da1bc6c3','073e1ca0-b5d6-11e8-a22e-3f02da1bc6c3','22e175b0-b5d6-11e8-a22e-3f02da1bc6c3','7689c7d0-b5d6-11e8-a22e-3f02da1bc6c3','Sony Xperia XA1, Blanco 32 Gb',15),('c6167cd0-0d2e-11e9-8708-bd30568592dd','f0eba990-ec5d-11e8-9fca-7791a022412d','b7acd3b0-0a27-11e9-93ce-6bdc9aa95e8f','ba142e20-b561-11e8-a22e-3f02da1bc6c3','073e1ca0-b5d6-11e8-a22e-3f02da1bc6c3','22e175b0-b5d6-11e8-a22e-3f02da1bc6c3','7689c7d0-b5d6-11e8-a22e-3f02da1bc6c3','Sony Xperia XA1, Gris 32 Gb',15),('d5630730-0a27-11e9-93ce-6bdc9aa95e8f','f0eba990-ec5d-11e8-9fca-7791a022412d','b7acd3b0-0a27-11e9-93ce-6bdc9aa95e8f','aafc3270-b561-11e8-a22e-3f02da1bc6c3','073e1ca0-b5d6-11e8-a22e-3f02da1bc6c3','22e175b0-b5d6-11e8-a22e-3f02da1bc6c3','7689c7d0-b5d6-11e8-a22e-3f02da1bc6c3','Sony Xperia XA1, Negro 32 Gb',15),('e6458c90-12e1-11e9-95fa-4537798ab2df','f0eba990-ec5d-11e8-9fca-7791a022412d','b7acd3b0-0a27-11e9-93ce-6bdc9aa95e8f','85dec2a0-c5d3-11e8-a892-b1d151a2612c','073e1ca0-b5d6-11e8-a22e-3f02da1bc6c3','22e175b0-b5d6-11e8-a22e-3f02da1bc6c3','6fd52ab0-b5d6-11e8-a22e-3f02da1bc6c3','Sony Xperia XA1, Naranja 16 Gb',15),('ede52aa0-ecfd-11e8-a91b-058493a62f06','f8a5f860-b55e-11e8-a22e-3f02da1bc6c3','0293dca0-b561-11e8-a22e-3f02da1bc6c3','aafc3270-b561-11e8-a22e-3f02da1bc6c3','073e1ca0-b5d6-11e8-a22e-3f02da1bc6c3','22e175b0-b5d6-11e8-a22e-3f02da1bc6c3','6fd52ab0-b5d6-11e8-a22e-3f02da1bc6c3','W&O Max 13, Negro 16 Gb',15),('f0a76630-0d2e-11e9-8708-bd30568592dd','f0eba990-ec5d-11e8-9fca-7791a022412d','b7acd3b0-0a27-11e9-93ce-6bdc9aa95e8f','ba142e20-b561-11e8-a22e-3f02da1bc6c3','073e1ca0-b5d6-11e8-a22e-3f02da1bc6c3','22e175b0-b5d6-11e8-a22e-3f02da1bc6c3','7cd96190-b5d6-11e8-a22e-3f02da1bc6c3','Sony Xperia XA1, Gris 64 Gb',15);
/*!40000 ALTER TABLE `Product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ProductHasAccessory`
--

DROP TABLE IF EXISTS `ProductHasAccessory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ProductHasAccessory` (
  `idProduct` char(36) NOT NULL,
  `idAccessory` char(36) NOT NULL,
  PRIMARY KEY (`idProduct`,`idAccessory`),
  KEY `product_this_idx` (`idProduct`),
  KEY `accessory_this_idx` (`idAccessory`),
  CONSTRAINT `accessory_this` FOREIGN KEY (`idAccessory`) REFERENCES `Accessory` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `product_this` FOREIGN KEY (`idProduct`) REFERENCES `Product` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ProductHasAccessory`
--

LOCK TABLES `ProductHasAccessory` WRITE;
/*!40000 ALTER TABLE `ProductHasAccessory` DISABLE KEYS */;
/*!40000 ALTER TABLE `ProductHasAccessory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ProductModel`
--

DROP TABLE IF EXISTS `ProductModel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ProductModel` (
  `id` char(36) NOT NULL,
  `idBrand` char(36) NOT NULL,
  `name` varchar(45) NOT NULL,
  `tag` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `MODEL_UNIQUE` (`id`,`idBrand`),
  KEY `brand_model_idx` (`idBrand`),
  CONSTRAINT `brand_model` FOREIGN KEY (`idBrand`) REFERENCES `Brand` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ProductModel`
--

LOCK TABLES `ProductModel` WRITE;
/*!40000 ALTER TABLE `ProductModel` DISABLE KEYS */;
INSERT INTO `ProductModel` VALUES ('0293dca0-b561-11e8-a22e-3f02da1bc6c3','f8a5f860-b55e-11e8-a22e-3f02da1bc6c3','Max 13','max-13'),('0df67370-0d2f-11e9-8708-bd30568592dd','0893aab0-0d2f-11e9-8708-bd30568592dd','M2','m2'),('3ad76980-c671-11e8-a469-8596b1acfbf3','f6652260-c670-11e8-a469-8596b1acfbf3','Sim Trio','sim-trio'),('b7acd3b0-0a27-11e9-93ce-6bdc9aa95e8f','f0eba990-ec5d-11e8-9fca-7791a022412d','Xperia XA1','xperia-xa1');
/*!40000 ALTER TABLE `ProductModel` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ProductType`
--

DROP TABLE IF EXISTS `ProductType`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ProductType` (
  `id` char(36) NOT NULL,
  `name` varchar(45) NOT NULL,
  `satCode` varchar(15) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ProductType`
--

LOCK TABLES `ProductType` WRITE;
/*!40000 ALTER TABLE `ProductType` DISABLE KEYS */;
INSERT INTO `ProductType` VALUES ('073e1ca0-b5d6-11e8-a22e-3f02da1bc6c3','Celular','43191500'),('52d333d0-c670-11e8-a469-8596b1acfbf3','Chip telefónico','43191500');
/*!40000 ALTER TABLE `ProductType` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ProductVariant`
--

DROP TABLE IF EXISTS `ProductVariant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ProductVariant` (
  `id` char(36) NOT NULL,
  `idProductType` char(36) NOT NULL,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `VARIANT_UNIQUE` (`id`,`idProductType`),
  KEY `type_variant_idx` (`idProductType`),
  CONSTRAINT `type_variant` FOREIGN KEY (`idProductType`) REFERENCES `ProductType` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ProductVariant`
--

LOCK TABLES `ProductVariant` WRITE;
/*!40000 ALTER TABLE `ProductVariant` DISABLE KEYS */;
INSERT INTO `ProductVariant` VALUES ('22e175b0-b5d6-11e8-a22e-3f02da1bc6c3','073e1ca0-b5d6-11e8-a22e-3f02da1bc6c3','Memoria'),('a5ed4fb0-c670-11e8-a469-8596b1acfbf3','52d333d0-c670-11e8-a469-8596b1acfbf3','Red');
/*!40000 ALTER TABLE `ProductVariant` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ProductVariantOption`
--

DROP TABLE IF EXISTS `ProductVariantOption`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ProductVariantOption` (
  `id` char(36) NOT NULL,
  `idProductVariant` char(36) NOT NULL,
  `idProductType` char(36) NOT NULL,
  `index` int(11) NOT NULL DEFAULT '0',
  `value` varchar(45) NOT NULL,
  `tag` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `OPTION_UNIQUE` (`id`,`idProductVariant`,`idProductType`),
  KEY `variant_option_idx` (`idProductVariant`,`idProductType`),
  CONSTRAINT `variant_option` FOREIGN KEY (`idProductVariant`, `idProductType`) REFERENCES `ProductVariant` (`id`, `idProductType`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ProductVariantOption`
--

LOCK TABLES `ProductVariantOption` WRITE;
/*!40000 ALTER TABLE `ProductVariantOption` DISABLE KEYS */;
INSERT INTO `ProductVariantOption` VALUES ('56ec84d0-b5d6-11e8-a22e-3f02da1bc6c3','22e175b0-b5d6-11e8-a22e-3f02da1bc6c3','073e1ca0-b5d6-11e8-a22e-3f02da1bc6c3',1,'1 Gb','1-gb'),('5e285350-b5d6-11e8-a22e-3f02da1bc6c3','22e175b0-b5d6-11e8-a22e-3f02da1bc6c3','073e1ca0-b5d6-11e8-a22e-3f02da1bc6c3',2,'2 Gb','2-gb'),('631a0ac0-b5d6-11e8-a22e-3f02da1bc6c3','22e175b0-b5d6-11e8-a22e-3f02da1bc6c3','073e1ca0-b5d6-11e8-a22e-3f02da1bc6c3',3,'4 Gb','4-gb'),('685eeb40-b5d6-11e8-a22e-3f02da1bc6c3','22e175b0-b5d6-11e8-a22e-3f02da1bc6c3','073e1ca0-b5d6-11e8-a22e-3f02da1bc6c3',4,'8 Gb','8-gb'),('6fd52ab0-b5d6-11e8-a22e-3f02da1bc6c3','22e175b0-b5d6-11e8-a22e-3f02da1bc6c3','073e1ca0-b5d6-11e8-a22e-3f02da1bc6c3',5,'16 Gb','16-gb'),('7689c7d0-b5d6-11e8-a22e-3f02da1bc6c3','22e175b0-b5d6-11e8-a22e-3f02da1bc6c3','073e1ca0-b5d6-11e8-a22e-3f02da1bc6c3',6,'32 Gb','32-gb'),('7cd96190-b5d6-11e8-a22e-3f02da1bc6c3','22e175b0-b5d6-11e8-a22e-3f02da1bc6c3','073e1ca0-b5d6-11e8-a22e-3f02da1bc6c3',7,'64 Gb','64-gb'),('8704aee0-b5d6-11e8-a22e-3f02da1bc6c3','22e175b0-b5d6-11e8-a22e-3f02da1bc6c3','073e1ca0-b5d6-11e8-a22e-3f02da1bc6c3',8,'128 Gb','128-gb'),('8d13bd30-b5d6-11e8-a22e-3f02da1bc6c3','22e175b0-b5d6-11e8-a22e-3f02da1bc6c3','073e1ca0-b5d6-11e8-a22e-3f02da1bc6c3',9,'256 Gb','256-gb'),('939f0060-b5d6-11e8-a22e-3f02da1bc6c3','22e175b0-b5d6-11e8-a22e-3f02da1bc6c3','073e1ca0-b5d6-11e8-a22e-3f02da1bc6c3',10,'512 Gb','512-gb'),('d2b7ae50-c670-11e8-a469-8596b1acfbf3','a5ed4fb0-c670-11e8-a469-8596b1acfbf3','52d333d0-c670-11e8-a469-8596b1acfbf3',0,'3G','3g'),('dc0a75f0-c670-11e8-a469-8596b1acfbf3','a5ed4fb0-c670-11e8-a469-8596b1acfbf3','52d333d0-c670-11e8-a469-8596b1acfbf3',1,'4G','4g');
/*!40000 ALTER TABLE `ProductVariantOption` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PurchaseOrder`
--

DROP TABLE IF EXISTS `PurchaseOrder`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PurchaseOrder` (
  `id` char(36) NOT NULL,
  `idWarehouse` char(36) NOT NULL,
  `idProvider` char(36) DEFAULT NULL,
  `idCompany` char(36) DEFAULT NULL,
  `idUser` char(36) DEFAULT NULL,
  `number` varchar(11) NOT NULL,
  `purchaseDate` date DEFAULT NULL,
  `paymentMethod` varchar(45) NOT NULL DEFAULT 'unknown',
  `paymentRule` varchar(45) NOT NULL DEFAULT '',
  `paymentDate` date DEFAULT NULL,
  `paymentStatus` tinyint(4) DEFAULT '0',
  `folio` varchar(45) DEFAULT NULL,
  `currency` varchar(45) DEFAULT NULL,
  `currencyExchange` decimal(8,2) DEFAULT NULL,
  `total` decimal(11,2) DEFAULT NULL,
  `brandDiscount` decimal(8,2) DEFAULT '0.00',
  `additionalDiscount` decimal(8,2) DEFAULT '0.00',
  `payment` decimal(8,2) DEFAULT '0.00',
  `file` varchar(100) DEFAULT NULL,
  `status` varchar(45) DEFAULT 'open',
  `finishedDate` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `warehouse_purchase_idx` (`idWarehouse`),
  CONSTRAINT `warehouse_purchase` FOREIGN KEY (`idWarehouse`) REFERENCES `Warehouse` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PurchaseOrder`
--

LOCK TABLES `PurchaseOrder` WRITE;
/*!40000 ALTER TABLE `PurchaseOrder` DISABLE KEYS */;
/*!40000 ALTER TABLE `PurchaseOrder` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Role`
--

DROP TABLE IF EXISTS `Role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(512) NOT NULL,
  `description` varchar(512) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Role`
--

LOCK TABLES `Role` WRITE;
/*!40000 ALTER TABLE `Role` DISABLE KEYS */;
INSERT INTO `Role` VALUES (1,'warehouse-boss',NULL,'2019-01-08 17:49:47','2019-01-08 17:49:47'),(2,'admin',NULL,'2019-01-08 17:49:47','2019-01-08 17:49:47'),(3,'storer',NULL,'2019-01-08 17:49:47','2019-01-08 17:49:47'),(4,'support',NULL,'2019-01-08 17:49:47','2019-01-08 17:49:47'),(5,'seller',NULL,'2019-01-08 17:49:47','2019-01-08 17:49:47'),(6,'accountant',NULL,'2019-01-08 17:49:47','2019-01-08 17:49:47'),(7,'manager',NULL,'2019-01-08 17:49:47','2019-01-08 17:49:47'),(8,'ceo',NULL,'2019-01-08 17:49:47','2019-01-08 17:49:47');
/*!40000 ALTER TABLE `Role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RoleMapping`
--

DROP TABLE IF EXISTS `RoleMapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `RoleMapping` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `principalType` varchar(512) DEFAULT NULL,
  `principalId` varchar(255) DEFAULT NULL,
  `roleId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `principalId` (`principalId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RoleMapping`
--

LOCK TABLES `RoleMapping` WRITE;
/*!40000 ALTER TABLE `RoleMapping` DISABLE KEYS */;
INSERT INTO `RoleMapping` VALUES (1,'USER','c9f2db10-136d-11e9-bea1-5b35f2aa1f82',2),(2,'USER','d9142060-137f-11e9-93bf-1b522a6f7761',1),(3,'USER','0ed54b20-183a-11e9-a70b-e1d3c1cd98df',4),(4,'USER','e24bf180-1857-11e9-aa52-01bf601a2b94',5);
/*!40000 ALTER TABLE `RoleMapping` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SellerHasClient`
--

DROP TABLE IF EXISTS `SellerHasClient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SellerHasClient` (
  `id` char(36) NOT NULL,
  `idSeller` char(36) NOT NULL,
  `idClient` char(36) NOT NULL,
  PRIMARY KEY (`idSeller`,`idClient`),
  KEY `client_assignment_idx` (`idClient`),
  CONSTRAINT `client_assignment` FOREIGN KEY (`idClient`) REFERENCES `Billing` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `seller_assignment` FOREIGN KEY (`idSeller`) REFERENCES `SysUser` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SellerHasClient`
--

LOCK TABLES `SellerHasClient` WRITE;
/*!40000 ALTER TABLE `SellerHasClient` DISABLE KEYS */;
/*!40000 ALTER TABLE `SellerHasClient` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Stock`
--

DROP TABLE IF EXISTS `Stock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Stock` (
  `id` char(36) NOT NULL,
  `idBatch` char(36) NOT NULL,
  `idPurchaseOrder` char(36) DEFAULT NULL,
  `idProduct` char(36) NOT NULL,
  `idWarehouse` char(36) NOT NULL,
  `idUser` char(36) NOT NULL,
  `idOrderHasProduct` char(36) DEFAULT NULL,
  `IMEI` varchar(20) NOT NULL,
  `date` datetime DEFAULT CURRENT_TIMESTAMP,
  `cost` decimal(8,2) DEFAULT NULL,
  `modifiedCost` decimal(8,2) DEFAULT NULL,
  `publicPrice` decimal(8,2) DEFAULT NULL,
  `salesPrice` decimal(8,2) DEFAULT NULL,
  `status` varchar(45) NOT NULL,
  `isRefurb` tinyint(4) DEFAULT '0',
  `class` char(1) DEFAULT 'S',
  `idClient` char(36) DEFAULT NULL,
  `saleDate` date DEFAULT NULL,
  `validate` tinyint(4) DEFAULT '1',
  `rewarded` tinyint(4) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IMEI_UNIQUE` (`IMEI`),
  KEY `warehouse_stock_idx` (`idWarehouse`),
  KEY `batch_stock_idx` (`idBatch`,`idPurchaseOrder`,`idProduct`),
  CONSTRAINT `batch_stock` FOREIGN KEY (`idBatch`, `idPurchaseOrder`, `idProduct`) REFERENCES `Batch` (`id`, `idPurchaseOrder`, `idProduct`) ON UPDATE CASCADE,
  CONSTRAINT `warehouse_stock` FOREIGN KEY (`idWarehouse`) REFERENCES `Warehouse` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Stock`
--

LOCK TABLES `Stock` WRITE;
/*!40000 ALTER TABLE `Stock` DISABLE KEYS */;
INSERT INTO `Stock` VALUES ('1a8ccbd0-183c-11e9-a70b-e1d3c1cd98df','218adff0-183a-11e9-a70b-e1d3c1cd98df',NULL,'21895950-183a-11e9-a70b-e1d3c1cd98df','4b301ee0-183c-11e9-a70b-e1d3c1cd98df','e24bf180-1857-11e9-aa52-01bf601a2b94',NULL,'356825080569767','2019-01-14 14:36:43',0.00,0.00,0.00,NULL,'sold',0,'S','2fb85190-185b-11e9-854d-6d5d71b35990','2019-01-14',1,0),('1b66ff30-183c-11e9-a70b-e1d3c1cd98df','218adff0-183a-11e9-a70b-e1d3c1cd98df',NULL,'21895950-183a-11e9-a70b-e1d3c1cd98df','4b301ee0-183c-11e9-a70b-e1d3c1cd98df','0ed54b20-183a-11e9-a70b-e1d3c1cd98df',NULL,'356825080569783','2019-01-14 14:36:44',0.00,0.00,0.00,NULL,'assigned',0,'S',NULL,NULL,0,0),('1bb6cce0-183c-11e9-a70b-e1d3c1cd98df','218adff0-183a-11e9-a70b-e1d3c1cd98df',NULL,'21895950-183a-11e9-a70b-e1d3c1cd98df','79914320-13a7-11e9-98f3-6963032782d8','0ed54b20-183a-11e9-a70b-e1d3c1cd98df',NULL,'356825080569809','2019-01-14 14:36:45',0.00,0.00,0.00,NULL,'assigned',0,'S',NULL,NULL,0,0),('1c1d2fd0-183c-11e9-a70b-e1d3c1cd98df','218adff0-183a-11e9-a70b-e1d3c1cd98df',NULL,'21895950-183a-11e9-a70b-e1d3c1cd98df','c9e0b2a0-136d-11e9-bea1-5b35f2aa1f82','0ed54b20-183a-11e9-a70b-e1d3c1cd98df',NULL,'356825080569841','2019-01-14 14:36:46',0.00,0.00,0.00,NULL,'active',0,'S',NULL,NULL,1,0),('1c727bc0-183c-11e9-a70b-e1d3c1cd98df','218adff0-183a-11e9-a70b-e1d3c1cd98df',NULL,'21895950-183a-11e9-a70b-e1d3c1cd98df','c9e0b2a0-136d-11e9-bea1-5b35f2aa1f82','0ed54b20-183a-11e9-a70b-e1d3c1cd98df',NULL,'356825080569866','2019-01-14 14:36:46',0.00,0.00,0.00,NULL,'active',0,'S',NULL,NULL,1,0),('1cc7c7b0-183c-11e9-a70b-e1d3c1cd98df','218adff0-183a-11e9-a70b-e1d3c1cd98df',NULL,'21895950-183a-11e9-a70b-e1d3c1cd98df','c9e0b2a0-136d-11e9-bea1-5b35f2aa1f82','0ed54b20-183a-11e9-a70b-e1d3c1cd98df',NULL,'356825080569908','2019-01-14 14:36:47',0.00,0.00,0.00,NULL,'active',0,'S',NULL,NULL,1,0),('1d1e2510-183c-11e9-a70b-e1d3c1cd98df','218adff0-183a-11e9-a70b-e1d3c1cd98df',NULL,'21895950-183a-11e9-a70b-e1d3c1cd98df','c9e0b2a0-136d-11e9-bea1-5b35f2aa1f82','0ed54b20-183a-11e9-a70b-e1d3c1cd98df',NULL,'356825080569924','2019-01-14 14:36:47',0.00,0.00,0.00,NULL,'active',0,'S',NULL,NULL,1,0),('1d767e40-183c-11e9-a70b-e1d3c1cd98df','218adff0-183a-11e9-a70b-e1d3c1cd98df',NULL,'21895950-183a-11e9-a70b-e1d3c1cd98df','c9e0b2a0-136d-11e9-bea1-5b35f2aa1f82','0ed54b20-183a-11e9-a70b-e1d3c1cd98df',NULL,'356825080569940','2019-01-14 14:36:48',0.00,0.00,0.00,NULL,'active',0,'S',NULL,NULL,1,0),('1dd0d340-183c-11e9-a70b-e1d3c1cd98df','218adff0-183a-11e9-a70b-e1d3c1cd98df',NULL,'21895950-183a-11e9-a70b-e1d3c1cd98df','c9e0b2a0-136d-11e9-bea1-5b35f2aa1f82','0ed54b20-183a-11e9-a70b-e1d3c1cd98df',NULL,'356825080569965','2019-01-14 14:36:48',0.00,0.00,0.00,NULL,'active',0,'S',NULL,NULL,1,0),('1e1e7e10-183c-11e9-a70b-e1d3c1cd98df','218adff0-183a-11e9-a70b-e1d3c1cd98df',NULL,'21895950-183a-11e9-a70b-e1d3c1cd98df','c9e0b2a0-136d-11e9-bea1-5b35f2aa1f82','0ed54b20-183a-11e9-a70b-e1d3c1cd98df',NULL,'356825080570021','2019-01-14 14:36:49',0.00,0.00,0.00,NULL,'active',0,'S',NULL,NULL,1,0);
/*!40000 ALTER TABLE `Stock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `StockLog`
--

DROP TABLE IF EXISTS `StockLog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `StockLog` (
  `id` char(36) NOT NULL,
  `idStock` char(36) NOT NULL,
  `date` datetime DEFAULT CURRENT_TIMESTAMP,
  `event` varchar(15) NOT NULL,
  `description` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `stock_log_idx` (`idStock`),
  CONSTRAINT `stock_log` FOREIGN KEY (`idStock`) REFERENCES `Stock` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `StockLog`
--

LOCK TABLES `StockLog` WRITE;
/*!40000 ALTER TABLE `StockLog` DISABLE KEYS */;
INSERT INTO `StockLog` VALUES ('1a8e7980-183c-11e9-a70b-e1d3c1cd98df','1a8ccbd0-183c-11e9-a70b-e1d3c1cd98df','2019-01-14 14:36:43','create','Ingreso del equipo al sistema.'),('1b6885d0-183c-11e9-a70b-e1d3c1cd98df','1b66ff30-183c-11e9-a70b-e1d3c1cd98df','2019-01-14 14:36:44','create','Ingreso del equipo al sistema.'),('1bb85380-183c-11e9-a70b-e1d3c1cd98df','1bb6cce0-183c-11e9-a70b-e1d3c1cd98df','2019-01-14 14:36:45','create','Ingreso del equipo al sistema.'),('1c1d7df0-183c-11e9-a70b-e1d3c1cd98df','1c1d2fd0-183c-11e9-a70b-e1d3c1cd98df','2019-01-14 14:36:46','create','Ingreso del equipo al sistema.'),('1c740260-183c-11e9-a70b-e1d3c1cd98df','1c727bc0-183c-11e9-a70b-e1d3c1cd98df','2019-01-14 14:36:46','create','Ingreso del equipo al sistema.'),('1cc94e50-183c-11e9-a70b-e1d3c1cd98df','1cc7c7b0-183c-11e9-a70b-e1d3c1cd98df','2019-01-14 14:36:47','create','Ingreso del equipo al sistema.'),('1d1fd2c0-183c-11e9-a70b-e1d3c1cd98df','1d1e2510-183c-11e9-a70b-e1d3c1cd98df','2019-01-14 14:36:47','create','Ingreso del equipo al sistema.'),('1d7804e0-183c-11e9-a70b-e1d3c1cd98df','1d767e40-183c-11e9-a70b-e1d3c1cd98df','2019-01-14 14:36:48','create','Ingreso del equipo al sistema.'),('1dd19690-183c-11e9-a70b-e1d3c1cd98df','1dd0d340-183c-11e9-a70b-e1d3c1cd98df','2019-01-14 14:36:48','create','Ingreso del equipo al sistema.'),('1e202bc0-183c-11e9-a70b-e1d3c1cd98df','1e1e7e10-183c-11e9-a70b-e1d3c1cd98df','2019-01-14 14:36:49','create','Ingreso del equipo al sistema.'),('b04e0260-1855-11e9-aa52-01bf601a2b94','1a8ccbd0-183c-11e9-a70b-e1d3c1cd98df','2019-01-14 17:39:52','assigned','Traspaso de Almacén Central a Pre-almacén.'),('b0504c50-1855-11e9-aa52-01bf601a2b94','1b66ff30-183c-11e9-a70b-e1d3c1cd98df','2019-01-14 17:39:52','assigned','Traspaso de Almacén Central a Pre-almacén.'),('b05136b0-1855-11e9-aa52-01bf601a2b94','1bb6cce0-183c-11e9-a70b-e1d3c1cd98df','2019-01-14 17:39:52','assigned','Traspaso de Almacén Central a Pre-almacén.'),('e76c44f0-1855-11e9-aa52-01bf601a2b94','1a8ccbd0-183c-11e9-a70b-e1d3c1cd98df','2019-01-14 17:41:24','assigned','Traspaso de Pre-almacén a Ruta de ejemplo.'),('e76ce130-1855-11e9-aa52-01bf601a2b94','1b66ff30-183c-11e9-a70b-e1d3c1cd98df','2019-01-14 17:41:24','assigned','Traspaso de Pre-almacén a Ruta de ejemplo.');
/*!40000 ALTER TABLE `StockLog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SysUser`
--

DROP TABLE IF EXISTS `SysUser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SysUser` (
  `id` char(36) NOT NULL,
  `idParent` char(36) DEFAULT NULL,
  `type` varchar(20) NOT NULL DEFAULT 'test',
  `employedId` varchar(20) DEFAULT NULL,
  `accountStatus` varchar(30) NOT NULL DEFAULT 'active',
  `username` varchar(80) DEFAULT NULL,
  `email` varchar(120) NOT NULL,
  `password` varchar(512) NOT NULL,
  `emailVerified` tinyint(1) DEFAULT NULL,
  `verificationToken` varchar(512) DEFAULT NULL,
  `name` varchar(60) DEFAULT NULL,
  `lastName` varchar(120) DEFAULT NULL,
  `alias` varchar(45) DEFAULT NULL,
  `birthDate` date DEFAULT NULL,
  `date` datetime DEFAULT CURRENT_TIMESTAMP,
  `isAdmin` tinyint(4) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  KEY `manager_seller_idx` (`idParent`),
  CONSTRAINT `manager_seller` FOREIGN KEY (`idParent`) REFERENCES `SysUser` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SysUser`
--

LOCK TABLES `SysUser` WRITE;
/*!40000 ALTER TABLE `SysUser` DISABLE KEYS */;
INSERT INTO `SysUser` VALUES ('0ed54b20-183a-11e9-a70b-e1d3c1cd98df','c9f2db10-136d-11e9-bea1-5b35f2aa1f82','support',NULL,'active',NULL,'support@multiplicame.com','$2a$10$n4wxyjzW2IZdpOxVPy/2gelZXkWNM5Br9BA.CncLPJafwdjI8D/ry',NULL,NULL,'Enrique','Soporte',NULL,NULL,'2019-01-14 14:22:04',0),('c9f2db10-136d-11e9-bea1-5b35f2aa1f82',NULL,'admin',NULL,'active','admin','enrique.sotelo@madmedia.com.mx','$2a$10$fVJ3oby8CrODRAhmr0ynOuevag7rTG9CXE2aZjKKvLEbtxzsFlxG2',NULL,NULL,'Enrique','Sotelo Ponce',NULL,NULL,'2019-01-08 11:49:47',1),('d9142060-137f-11e9-93bf-1b522a6f7761','c9f2db10-136d-11e9-bea1-5b35f2aa1f82','warehouse-boss',NULL,'active',NULL,'warehouse-boss@multiplicame.com','$2a$10$FgGQBAj3kkECamNtEuWoBO.n80VAUNmQGAZruVyyQ6xj.yPW/w/12',NULL,NULL,'Blanca','Monroy',NULL,NULL,'2019-01-08 13:59:03',1),('e24bf180-1857-11e9-aa52-01bf601a2b94','c9f2db10-136d-11e9-bea1-5b35f2aa1f82','seller',NULL,'active',NULL,'seller@multiplicame.com','$2a$10$htMu0G5tjEUDB32Fwv6i/eFNTJCCg4tjAtVi.RTvkYDdtH7S5NgqG',NULL,NULL,'Enrique','Vendedor',NULL,NULL,'2019-01-14 17:55:34',0);
/*!40000 ALTER TABLE `SysUser` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Warehouse`
--

DROP TABLE IF EXISTS `Warehouse`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Warehouse` (
  `id` char(36) NOT NULL,
  `idParent` char(36) DEFAULT NULL,
  `name` varchar(45) NOT NULL,
  `type` varchar(45) NOT NULL,
  `address` varchar(45) DEFAULT NULL,
  `isMain` tinyint(4) DEFAULT '0',
  `date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `parent_child_idx` (`idParent`),
  CONSTRAINT `parent_child` FOREIGN KEY (`idParent`) REFERENCES `Warehouse` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Warehouse`
--

LOCK TABLES `Warehouse` WRITE;
/*!40000 ALTER TABLE `Warehouse` DISABLE KEYS */;
INSERT INTO `Warehouse` VALUES ('4b301ee0-183c-11e9-a70b-e1d3c1cd98df','79914320-13a7-11e9-98f3-6963032782d8','Ruta de ejemplo','seller',NULL,0,'2019-01-14 14:38:05'),('79914320-13a7-11e9-98f3-6963032782d8','c9e0b2a0-136d-11e9-bea1-5b35f2aa1f82','Pre-almacén','place','Calle Lago Margarita #49, piso 1',0,'2019-01-08 18:42:43'),('c9e0b2a0-136d-11e9-bea1-5b35f2aa1f82',NULL,'Almacén Central','place','Lago Margarita',1,'2019-01-08 11:49:47');
/*!40000 ALTER TABLE `Warehouse` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `WarehouseACL`
--

DROP TABLE IF EXISTS `WarehouseACL`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `WarehouseACL` (
  `id` char(36) NOT NULL,
  `idUser` char(36) NOT NULL,
  `idWarehouse` char(36) NOT NULL,
  `index` smallint(5) unsigned DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `user_acl_idx` (`idUser`),
  KEY `warehouse_acl_idx` (`idWarehouse`),
  CONSTRAINT `user_acl` FOREIGN KEY (`idUser`) REFERENCES `SysUser` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `warehouse_acl` FOREIGN KEY (`idWarehouse`) REFERENCES `Warehouse` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `WarehouseACL`
--

LOCK TABLES `WarehouseACL` WRITE;
/*!40000 ALTER TABLE `WarehouseACL` DISABLE KEYS */;
INSERT INTO `WarehouseACL` VALUES ('0ed746f0-183a-11e9-a70b-e1d3c1cd98df','0ed54b20-183a-11e9-a70b-e1d3c1cd98df','c9e0b2a0-136d-11e9-bea1-5b35f2aa1f82',0),('7ea56f50-13aa-11e9-98f3-6963032782d8','d9142060-137f-11e9-93bf-1b522a6f7761','79914320-13a7-11e9-98f3-6963032782d8',1),('c9f4afd0-136d-11e9-bea1-5b35f2aa1f82','c9f2db10-136d-11e9-bea1-5b35f2aa1f82','c9e0b2a0-136d-11e9-bea1-5b35f2aa1f82',0),('d9177bc0-137f-11e9-93bf-1b522a6f7761','d9142060-137f-11e9-93bf-1b522a6f7761','c9e0b2a0-136d-11e9-bea1-5b35f2aa1f82',0),('e24ed7b0-1857-11e9-aa52-01bf601a2b94','e24bf180-1857-11e9-aa52-01bf601a2b94','4b301ee0-183c-11e9-a70b-e1d3c1cd98df',0);
/*!40000 ALTER TABLE `WarehouseACL` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-01-15 20:10:33

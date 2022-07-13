-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Wersja serwera:               10.4.22-MariaDB - mariadb.org binary distribution
-- Serwer OS:                    Win64
-- HeidiSQL Wersja:              11.3.0.6295
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Zrzucanie danych dla tabeli shop.basketelements: ~4 rows (około)
/*!40000 ALTER TABLE `basketelements` DISABLE KEYS */;
INSERT INTO `basketelements` (`id`, `shopItemId`, `userId`, `quantity`) VALUES
	('28724657-0280-11ed-bcc7-00d861bcb3d8', 'ce8f6488-027e-11ed-bcc7-00d861bcb3d8', 'cb1aaae5-6f8f-48b8-b169-a94292d4545b', 2),
	('40f4c4a8-0280-11ed-bcc7-00d861bcb3d8', 'dc6b7afb-027e-11ed-bcc7-00d861bcb3d8', 'cb1aaae5-6f8f-48b8-b169-a94292d4545b', 1),
	('4a5ee58f-0280-11ed-bcc7-00d861bcb3d8', 'eb0156ce-027e-11ed-bcc7-00d861bcb3d8', 'cb1aaae5-6f8f-48b8-b169-a94292d4545b', 1),
	('51a75c57-0280-11ed-bcc7-00d861bcb3d8', 'f96f3136-027e-11ed-bcc7-00d861bcb3d8', 'ba9e0e4a-b43a-41a4-8a16-62ce28f1aaf1', 2);
/*!40000 ALTER TABLE `basketelements` ENABLE KEYS */;

-- Zrzucanie danych dla tabeli shop.categories: ~4 rows (około)
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` (`id`, `name`) VALUES
	('0ef145ae-7dd0-4ee5-b7e3-6bc855f4bf2f', 'alkochol'),
	('6224df54-e244-4871-9fdf-1e6da7609825', 'elektronika'),
	('b62b52eb-b0dc-4e9a-928f-f2f6be2ecd2a', 'napoje'),
	('1adf8303-3089-442f-845e-e80e8847da43', 'spożywcze');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;

-- Zrzucanie danych dla tabeli shop.personalinfo: ~3 rows (około)
/*!40000 ALTER TABLE `personalinfo` DISABLE KEYS */;
INSERT INTO `personalinfo` (`id`, `userId`, `name`, `surname`, `city`, `country`, `street`, `buildingNumber`, `postalCode`) VALUES
	('4dc5565f-2ebb-4f3e-990b-aa2816ac094e', 'cb1aaae5-6f8f-48b8-b169-a94292d4545b', 'ala', 'kot', NULL, NULL, NULL, NULL, NULL),
	('9063b8a1-618f-45ae-a8c3-bfa5ae32476e', 'ba9e0e4a-b43a-41a4-8a16-62ce28f1aaf1', 'alojzy', NULL, 'warszawa', 'polska', NULL, NULL, NULL),
	('c82da935-652d-4c8c-a5c9-3ba308a2ebce', 'c64c3dd5-c137-48b9-af1c-24ff2f531797', NULL, 'nojman', 'poznań', 'polska', NULL, NULL, NULL);
/*!40000 ALTER TABLE `personalinfo` ENABLE KEYS */;

-- Zrzucanie danych dla tabeli shop.shopitems: ~10 rows (około)
/*!40000 ALTER TABLE `shopitems` DISABLE KEYS */;
INSERT INTO `shopitems` (`id`, `name`, `img`, `quantity`, `price`, `categoryId`) VALUES
	('01118a4f-027f-11ed-bcc7-00d861bcb3d8', 'wino', NULL, 14, 10.00, '0ef145ae-7dd0-4ee5-b7e3-6bc855f4bf2f'),
	('1dcd5aca-027f-11ed-bcc7-00d861bcb3d8', 'wódka', NULL, 9, 25.00, '0ef145ae-7dd0-4ee5-b7e3-6bc855f4bf2f'),
	('33defeac-027f-11ed-bcc7-00d861bcb3d8', 'sok pomarańczowy', NULL, 15, 2.50, 'b62b52eb-b0dc-4e9a-928f-f2f6be2ecd2a'),
	('4645b05f-027f-11ed-bcc7-00d861bcb3d8', 'sok marchwiowy', NULL, 3, 2.00, 'b62b52eb-b0dc-4e9a-928f-f2f6be2ecd2a'),
	('4f5626e7-027f-11ed-bcc7-00d861bcb3d8', 'mikrofalówka', NULL, 2, 300.00, '6224df54-e244-4871-9fdf-1e6da7609825'),
	('5f134b31-027f-11ed-bcc7-00d861bcb3d8', 'lodówka', NULL, 2, 1400.00, '6224df54-e244-4871-9fdf-1e6da7609825'),
	('ce8f6488-027e-11ed-bcc7-00d861bcb3d8', 'bułka', NULL, 40, 0.40, '1adf8303-3089-442f-845e-e80e8847da43'),
	('dc6b7afb-027e-11ed-bcc7-00d861bcb3d8', 'chleb', NULL, 20, 5.00, '1adf8303-3089-442f-845e-e80e8847da43'),
	('eb0156ce-027e-11ed-bcc7-00d861bcb3d8', 'dżem', NULL, 10, 3.00, '1adf8303-3089-442f-845e-e80e8847da43'),
	('f96f3136-027e-11ed-bcc7-00d861bcb3d8', 'piwo', NULL, 39, 4.00, '0ef145ae-7dd0-4ee5-b7e3-6bc855f4bf2f');
/*!40000 ALTER TABLE `shopitems` ENABLE KEYS */;

-- Zrzucanie danych dla tabeli shop.users: ~3 rows (około)
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `email`, `login`, `password`) VALUES
	('ba9e0e4a-b43a-41a4-8a16-62ce28f1aaf1', 'alo.kmin@gmail.com', 'alojzy', '$2b$10$ffA4z7XBWIo2FHir5sgI6.3uTZTYP6Mu9/XMltDwY5KdH5dwdVgR2'),
	('c64c3dd5-c137-48b9-af1c-24ff2f531797', 'jan@gmail.com', 'janek', '$2b$10$m2JkGHKATCOcAxz52BFSzuVnA00cXq.8UxSat4nI1ZtvXNgatpX82'),
	('cb1aaae5-6f8f-48b8-b169-a94292d4545b', 'ala.kot@gmail.com', 'kotolak', '$2b$10$8VtBH.JaXR1bPoIynH3lReu9qD1IxQksVsAfitMpEfIhOBp4yIlne');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;

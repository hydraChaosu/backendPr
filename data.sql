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

-- Zrzucanie danych dla tabeli shop.basketelements: ~3 rows (około)
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
                                            ('1adf8303-3089-442f-845e-e80e8847da43', 'spożywcze'),
                                            ('eed131f7-f04e-4bf6-b85a-8d766df61b14', 'zwierze');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;

-- Zrzucanie danych dla tabeli shop.personalinfo: ~9 rows (około)
/*!40000 ALTER TABLE `personalinfo` DISABLE KEYS */;
INSERT INTO `personalinfo` (`id`, `userId`, `name`, `surname`, `city`, `country`, `street`, `buildingNumber`, `postalCode`) VALUES
                                                                                                                                ('4359f88e-2f9a-4363-a863-6dfb322de83d', 'bf8522df-791f-4578-976e-53e5a489a28f', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
                                                                                                                                ('4dc5565f-2ebb-4f3e-990b-aa2816ac094e', 'cb1aaae5-6f8f-48b8-b169-a94292d4545b', 'ala', 'kot', NULL, NULL, NULL, NULL, NULL),
                                                                                                                                ('62b05086-27f0-4e71-aace-31cb3f95dbc0', 'b61b2c6a-1260-4c8a-92e2-ef1f6b50b5ba', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
                                                                                                                                ('85e68bdf-432e-4bf5-a3a1-c5e31e70d886', 'a21c75fb-7a43-46d8-8a8b-46d7cdf1a64d', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
                                                                                                                                ('9063b8a1-618f-45ae-a8c3-bfa5ae32476e', 'ba9e0e4a-b43a-41a4-8a16-62ce28f1aaf1', 'alojzy', NULL, 'warszawa', 'polska', NULL, NULL, NULL),
                                                                                                                                ('a20a0df0-9909-4c9d-a15a-12f371575c6c', 'e23143aa-a5d3-4b3a-8e14-274ba18af81d', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
                                                                                                                                ('c009b550-46cd-4ded-a7c0-097967446dc6', 'cb03e6f2-e07d-4bd5-bda4-0e2a24eb0f9f', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
                                                                                                                                ('c82da935-652d-4c8c-a5c9-3ba308a2ebce', 'c64c3dd5-c137-48b9-af1c-24ff2f531797', NULL, 'nojman', 'poznań', 'polska', NULL, NULL, NULL),
                                                                                                                                ('d1272d8a-ca9b-4519-9dee-f2173c9a6e9b', '09c3a414-c50f-4d0f-92fe-d0dcf9b93026', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
                                                                                                                                ('e58c4c61-279c-4093-b45e-f031aeedfd67', 'b65ae4f8-29ae-48b1-be05-b0070a74dcbe', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
/*!40000 ALTER TABLE `personalinfo` ENABLE KEYS */;

-- Zrzucanie danych dla tabeli shop.shopitems: ~9 rows (około)
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

-- Zrzucanie danych dla tabeli shop.users: ~10 rows (około)
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `email`, `login`, `password`, `token`, `role`) VALUES
                                                                              ('09c3a414-c50f-4d0f-92fe-d0dcf9b93026', 'janusz11.kot@gmail.com', 'janusz11', '$2b$10$sP7FH2Lx9PXENYtYjt3tyeU.dzX8n.cHrGdcTPIb/1lHDKww/zIiy', NULL, 0),
                                                                              ('a21c75fb-7a43-46d8-8a8b-46d7cdf1a64d', 'a@a.p', 'rrrrrrrrrrrdfs', '$2b$10$nZmDbxoEmNQw/YdVhbm3qe/jQ1RYtujY5APzp2kbwYOwwhKNCOuoe', NULL, 0),
                                                                              ('b61b2c6a-1260-4c8a-92e2-ef1f6b50b5ba', 'admin@pl.pl', 'adminuser', '$2b$10$pWmp0bnhJKKP.Vb864XSAusZOrT1gI3ax07nQ95SklA/y0Nz6CWqK', 'd1cee155-06b5-45ad-b487-5aaae125aaf1', 1),
                                                                              ('b65ae4f8-29ae-48b1-be05-b0070a74dcbe', 'abmallim@gmail.com', 'rrrrrrrrrrr', '$2b$10$DJGHhlCN/uulvz.6Y7K04.Ug54x9u7w5varz/oZsCWwQnEUSo1AzG', NULL, 0),
                                                                              ('ba9e0e4a-b43a-41a4-8a16-62ce28f1aaf1', 'alo.kmin@gmail.com', 'alojzy', '$2b$10$ffA4z7XBWIo2FHir5sgI6.3uTZTYP6Mu9/XMltDwY5KdH5dwdVgR2', '', 0),
                                                                              ('bf8522df-791f-4578-976e-53e5a489a28f', 'janusz.kot@gmail.com', 'janusz', '$2b$10$uqp8M2SjMaE938nE0vhq1uMSBQllLTBytPZD7xbt6funl5uC5DskG', '5eb61f45-0a9c-49cf-93f7-996c39ca62bb', 0),
                                                                              ('c64c3dd5-c137-48b9-af1c-24ff2f531797', 'jan@gmail.com', 'janek', '$2b$10$m2JkGHKATCOcAxz52BFSzuVnA00cXq.8UxSat4nI1ZtvXNgatpX82', '', 0),
                                                                              ('cb03e6f2-e07d-4bd5-bda4-0e2a24eb0f9f', 'janusz1.kot@gmail.com', 'dupa', '$2b$10$Qfn81y8rqT3iptrPYT3PtOVuNKy36te3KobNDWX9t3w4Y4S3Jol02', NULL, 0),
                                                                              ('cb1aaae5-6f8f-48b8-b169-a94292d4545b', 'ala.kot@gmail.com', 'kotolak', '$2b$10$8VtBH.JaXR1bPoIynH3lReu9qD1IxQksVsAfitMpEfIhOBp4yIlne', '', 0),
                                                                              ('e23143aa-a5d3-4b3a-8e14-274ba18af81d', 'llim@gmail.com', 'ddd', '$2b$10$lai1BEAv8Tgqkln8SLFi1uCxs8zhRmxXsYbouKbYY6Yb9TWKZZ3K2', NULL, 0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;

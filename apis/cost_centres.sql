-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 15, 2019 at 12:05 PM
-- Server version: 10.1.21-MariaDB
-- PHP Version: 5.6.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `silaproc`
--

-- --------------------------------------------------------

--
-- Table structure for table `cost_centres`
--

CREATE TABLE `cost_centres` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `site_id` int(11) DEFAULT NULL,
  `status` tinyint(4) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `cost_centres`
--

INSERT INTO `cost_centres` (`id`, `name`, `site_id`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Ahuja Tower - New', NULL, 1, '2019-05-15 09:48:58', '2019-05-14 18:30:00'),
(2, 'Aristo Realty Developers Ltd  ( Pearl Residency ) - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(3, 'Ashford Infotech Private Ltd. - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(4, 'Bharucha & Partners ( Cecil Court ) - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(5, 'Bioplus Life Sciences Private Ltd. - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(6, 'Bira Bangalore - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(7, 'Bira Goa-New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(8, 'Bira - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(9, 'Bira Rajmandri-New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(10, 'C & B Square - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(11, 'Centrum ( New Delhi ) - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(12, 'Connectwell Industries Pvt. Ltd - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(13, 'Creative Garment ( Kalyan ) - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(14, 'Creative', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(15, 'Dai Ichi Karkaria Ltd - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(16, 'Decathlon sports - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(17, 'DEXTRUS - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(18, 'Donatus Victoria Estates Hotels Pvt Ltd - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(19, 'DY Patil School - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(20, 'G.A. Builders Pvt. Ltd.( Chembur ) - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(21, 'HDFC LTD - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(22, 'Hikal  Ltd  ( CBD Belapur ) - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(23, 'Hikal  Ltd ( Mahad ) - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(24, 'Hikal  Ltd ( Taloja ) - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(25, 'Icici Lombard - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(26, 'Jean Claude Biguine  ( Juhu ) - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(27, 'Jean Claude Biguine  ( Salon & SPa Bandra ) - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(28, 'Jean Claude Biguine  ( Salon & Spa Colaba ) - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(29, 'Jean Claude Biguine Salon & Spa (Kandivali) - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(30, 'Jean Claude Biguine  ( Salon & Spa Lower Parel ) - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(31, 'Kamadgiri Fashion Ltd  ( Bangkok Fashion ) - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(32, 'Lloyds Steels Industries ( Lowerparel ) - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(33, 'Mittal Bhavan - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(34, 'Mumbai Airport Lounge Services Pvt. Ltd. ( CIP 1) - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(35, 'Mumbai Airport Lounge Services Pvt. Ltd.( -CIP 2 ) - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(36, 'Mumbai Airport Lounge Services Pvt. Ltd. ( Domestic )- New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(37, 'Mumbai Airport Lounge Services Pvt. Ltd. ( Loyalty)- New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(38, 'Nayara Energy - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(39, 'Nival Developers - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(40, 'Nival Developers Private Limited - Gulita', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(41, 'Oasis City ( Kamala Mills ) - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(42, 'Omkar Realtors & Developers Pvt. Ltd. ( Andheri ) -New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(43, 'Pepperfry Bansawadi - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(44, 'Piramal  ( Annex ) - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(45, 'Piramal Enterprises  ( Kurla )  - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(46, 'Piramal Enterprises Ltd. ( 3rd Floor ) - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(47, 'Piramal Estates Pvt. Ltd ( V3 Design ) - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(48, 'Piramal - Glider Buildcon ( Dhobi Ghat )  - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(49, 'Piramal - Glider Buildcon Realtors Pvt Ltd ( Bycul ) - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(50, 'Piramal - Glider ( Bycula Sales ) - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(51, 'Piramal - PRL Developers Pvt Ltd. ( 8th Floor ) - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(52, 'Pocket Aces Pictures Private Limited - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(53, 'Polycab (3 ) - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(54, 'Raine LLP (BKC) - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(55, 'Raw Pressery -New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(56, 'Raychem RPG (HVCS) -New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(57, 'Raychem RPG -New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(58, 'RNA Corporation Pvt Ltd ( BKC ) - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(59, 'RNA Mirage - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(60, 'Ryker Base Pvt Ltd - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(61, 'Sonawala Building- New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(62, 'Sterling Towers - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(63, 'Tata Steel Khopoli - (New)', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(64, 'The J&K Bank Ltd. (Bangalore) - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(65, 'The J&K Bank Ltd.( BKC ) -New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(66, 'The J&K Bank Ltd. ( Haryana ) - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(67, 'The J&K Bank Ltd.( Maharashtra ) - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(68, 'The new usha-kiran Co-operative housing society Lt - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(69, 'Trade Facilities Management India Pvt. Ltd ( Camp ) - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(70, 'We Work (BKC) - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(71, 'We Work Masterpiece -New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(72, 'The J&K Bank Ltd ( Delhi ) - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(73, 'The J&K Bank Ltd ( Telegana ) - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(74, 'Aeris Aratt - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(75, 'Bill Forge Private Limited - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(76, 'Centrum Retail Services Ltd (House) - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(77, 'Ginger Hotel ( Aurangabad ) - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(78, 'Ginger Hotel ( Aurangabad ) - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(79, 'Ginger Hotel Mahakali - (New)', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(80, 'Ginger Hotel - Vadodara - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(81, 'Ginger Surat - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(82, 'Platinum City - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(83, 'Raheja Princes Apts.Pvt.Ltd ( Prabhadevi ) - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(84, 'Alok Industries Ltd.( Silvassa Unit 7 & 9 ) - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(85, 'Bhilosa - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(86, 'Goodwill Properties Pvt Ltd ( Goodwill ) - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(87, 'Gujarat Office -New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(88, 'Mister Homecare Services Private Ltd - Mumbai -New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(89, 'Mumbai International Airport Ltd ( Artwall ) - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(90, 'Rohan Group - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(91, 'Sanathan Textile - New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(92, 'Sila Head Office -New', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cost_centres`
--
ALTER TABLE `cost_centres`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cost_centres`
--
ALTER TABLE `cost_centres`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=93;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 30, 2019 at 11:41 AM
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
-- Table structure for table `brands`
--

CREATE TABLE `brands` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `status` tinyint(4) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `brands`
--

INSERT INTO `brands` (`id`, `name`, `status`, `created_at`, `updated_at`) VALUES
(1, 'HP', 1, '2019-02-25 05:11:30', '2019-02-25 05:11:30'),
(2, 'Lenevo', 1, '2019-02-25 05:12:05', '2019-02-25 05:12:05'),
(3, 'Dell', 1, '2019-02-25 05:12:14', '2019-02-25 05:12:14');

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `status` tinyint(4) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `name`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Mobile', 1, '2019-02-22 05:26:47', '2019-02-22 05:26:47'),
(2, 'Laptop', 1, '2019-02-22 05:28:52', '2019-02-22 05:28:52'),
(3, 'Desktop', 1, '2019-02-22 05:28:58', '2019-02-22 05:28:58'),
(4, 'Machines', 1, '2019-02-22 10:59:22', '2019-02-22 05:29:22'),
(5, 'Softwares', 1, '2019-02-22 05:29:32', '2019-02-22 05:29:32'),
(6, 'SIM', 1, '2019-02-22 05:29:38', '2019-02-22 05:29:38'),
(7, 'Dongles', 1, '2019-02-22 05:29:45', '2019-02-22 05:29:45');

-- --------------------------------------------------------

--
-- Table structure for table `company`
--

CREATE TABLE `company` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `status` tinyint(4) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `company`
--

INSERT INTO `company` (`id`, `name`, `status`, `created_at`, `updated_at`) VALUES
(1, 'SILA', 1, '2019-02-25 01:18:20', '2019-02-25 01:18:20'),
(2, 'SILA Projects', 1, '2019-02-25 01:18:33', '2019-02-25 01:18:33'),
(3, 'Envocare', 1, '2019-02-25 01:18:42', '2019-02-25 01:18:42');

-- --------------------------------------------------------

--
-- Table structure for table `cost_centres`
--

CREATE TABLE `cost_centres` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `site_id` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `cost_centres`
--

INSERT INTO `cost_centres` (`id`, `name`, `site_id`, `status`, `created_at`, `updated_at`) VALUES
(1, 'CC1', 2, 1, '2019-02-25 14:06:28', '2019-02-25 08:36:28'),
(2, 'Cost Centre 2', 1, 1, '2019-02-25 14:06:36', '2019-02-25 08:36:36');

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `site_id` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`id`, `name`, `site_id`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Billing', 1, 1, '2019-02-25 14:07:22', '2019-02-25 08:37:22'),
(2, 'Human Resource', 2, 1, '2019-02-25 14:07:32', '2019-02-25 08:37:32');

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `company_id` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `name`, `company_id`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Vinay Gangan', 1, 1, '2019-02-25 14:51:18', '2019-02-25 09:21:18'),
(2, 'Hareesh Pillai', 2, 1, '2019-02-25 14:51:37', '2019-02-25 09:21:37'),
(3, 'Sarfaraz Shaikh', 3, 1, '2019-03-29 07:11:43', '2019-03-29 07:11:43');

-- --------------------------------------------------------

--
-- Table structure for table `inventory`
--

CREATE TABLE `inventory` (
  `id` int(11) NOT NULL,
  `company_id` int(11) NOT NULL,
  `request_from_id` int(11) NOT NULL,
  `approved_by_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `product_description` text NOT NULL,
  `vendor_id` int(11) NOT NULL,
  `brand_id` int(11) NOT NULL,
  `serial_no` int(11) NOT NULL,
  `model_no_id` int(11) NOT NULL,
  `asset_code` varchar(200) NOT NULL,
  `asset_code_no` int(11) NOT NULL,
  `purchase_cost` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT;

--
-- Dumping data for table `inventory`
--

INSERT INTO `inventory` (`id`, `company_id`, `request_from_id`, `approved_by_id`, `category_id`, `product_description`, `vendor_id`, `brand_id`, `serial_no`, `model_no_id`, `asset_code`, `asset_code_no`, `purchase_cost`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 1, 1, 'xdfsdfs', 4, 1, 11223, 1, 'asdasd', 1, 56500, 1, '2019-03-25 12:47:36', '2019-03-25 07:17:36'),
(2, 2, 2, 2, 4, 'Test Machine Details', 4, 3, 45, 2, 'SP123', 1, 67000, 1, '2019-03-25 07:17:09', '2019-03-25 07:17:09'),
(3, 3, 3, 1, 2, 'New Laptop - 1230SIO009', 4, 3, 90087665, 2, 'AST23445', 1, 45000, 1, '2019-03-29 07:14:36', '2019-03-29 07:14:36');

-- --------------------------------------------------------

--
-- Table structure for table `inventory_transfer`
--

CREATE TABLE `inventory_transfer` (
  `id` int(11) NOT NULL,
  `inventory_id` int(11) NOT NULL,
  `site_id` int(11) NOT NULL,
  `cost_centre_id` int(11) NOT NULL,
  `rental_amount` int(11) NOT NULL,
  `transferred_site_id` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `inventory_transfer`
--

INSERT INTO `inventory_transfer` (`id`, `inventory_id`, `site_id`, `cost_centre_id`, `rental_amount`, `transferred_site_id`, `status`, `created_at`, `updated_at`) VALUES
(1, 2, 1, 2, 3450, 2, 1, '2019-04-08 03:20:28', '2019-04-08 03:20:28');

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

CREATE TABLE `items` (
  `id` int(11) NOT NULL,
  `item_type_id` int(11) NOT NULL,
  `name` int(11) NOT NULL,
  `code` varchar(10) NOT NULL,
  `status` tinyint(4) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `items_1`
--

CREATE TABLE `items_1` (
  `id` int(11) NOT NULL,
  `alias_code` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `hsn_code` varchar(100) NOT NULL,
  `gst_per` int(11) NOT NULL,
  `image` text NOT NULL,
  `type` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT;

-- --------------------------------------------------------

--
-- Table structure for table `item_calc`
--

CREATE TABLE `item_calc` (
  `id` int(11) NOT NULL,
  `proc_calc_id` int(11) NOT NULL,
  `description` varchar(255) NOT NULL,
  `brand` varchar(100) DEFAULT NULL,
  `unit` varchar(20) DEFAULT NULL,
  `hsn_code` varchar(50) NOT NULL,
  `gst_perc` double(10,2) NOT NULL,
  `cost_pre_gst` double(10,2) NOT NULL,
  `mrp` double(10,2) DEFAULT NULL,
  `mrp_pre_gst` double(10,2) DEFAULT NULL,
  `maximum_profit_chargeable` double(10,2) DEFAULT NULL,
  `profit_margin` double(10,2) NOT NULL,
  `selling_price` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT;

--
-- Dumping data for table `item_calc`
--

INSERT INTO `item_calc` (`id`, `proc_calc_id`, `description`, `brand`, `unit`, `hsn_code`, `gst_perc`, `cost_pre_gst`, `mrp`, `mrp_pre_gst`, `maximum_profit_chargeable`, `profit_margin`, `selling_price`, `created_at`, `updated_at`) VALUES
(1, 6, 'AIRSURE ROOM AIR FRESHNER ROSE', '', '', '33074900', 18.00, 72.04, 120.00, 101.69, 29.65, 22.24, '94.28', '2019-04-18 10:57:26', '2019-04-18 05:27:26'),
(2, 5, 'ALA (500 ML)', '', '', '34022020', 18.00, 44.06, 56.00, 47.46, 3.40, 2.55, '46.61', '2019-04-15 09:33:15', '2019-04-15 09:33:15'),
(3, 5, 'BRASSO (100 ML)', '', '', '34059010', 18.00, 67.80, 87.00, 73.73, 5.93, 4.45, '72.25', '2019-04-15 09:33:15', '2019-04-15 09:33:15'),
(4, 5, 'DETTOL ANTISEPTIC LQD (500ML)', '', '', '30049099', 12.00, 109.32, 131.00, 116.96, 7.64, 5.73, '115.05', '2019-04-15 09:33:15', '2019-04-15 09:33:15'),
(5, 6, 'BRASSO (100 ML)', '', '', '34059010', 18.00, 67.80, 87.00, 73.73, 5.93, 4.45, '72.25', '2019-04-18 05:27:26', '2019-04-18 05:27:26'),
(6, 4, 'AIRSURE ROOM AIR FRESHNER LEMON', '', '', '33074900', 18.00, 72.04, 120.00, 101.69, 29.65, 22.24, '94.28', '2019-04-18 05:49:18', '2019-04-18 05:49:18'),
(7, 4, 'AIRSURE ROOM AIR FRESHNER LAVENDER', '', '', '33074900', 18.00, 72.04, NULL, NULL, NULL, 35.00, '97.25', '2019-04-18 05:58:35', '2019-04-18 05:58:35'),
(8, 4, 'BRASSO (100 ML)', '', '', '34059010', 18.00, 67.80, 87.00, 73.73, 5.93, 4.45, '72.25', '2019-04-18 06:12:24', '2019-04-18 06:12:24'),
(9, 7, 'WHITE SPONGE', '', '', '73231000', 18.00, 7.84, NULL, NULL, NULL, 35.00, '10.58', '2019-04-18 06:14:08', '2019-04-18 06:14:08'),
(10, 4, 'STC BIG GLASS DUSTER (RED)', 'new brand', 'pieces', '63071010', 5.00, 13.50, NULL, NULL, NULL, 35.00, '18.23', '2019-04-22 13:46:12', '2019-04-22 08:14:45');

-- --------------------------------------------------------

--
-- Table structure for table `item_master`
--

CREATE TABLE `item_master` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `item_master`
--

INSERT INTO `item_master` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'AIRSURE ROOM AIR FRESHNER ROSE', '2019-04-15 09:03:16', '2019-04-15 09:03:16'),
(2, 'ALA (500 ML)', '2019-04-15 09:33:15', '2019-04-15 09:33:15'),
(3, 'BRASSO (100 ML)', '2019-04-15 09:33:15', '2019-04-15 09:33:15'),
(4, 'DETTOL ANTISEPTIC LQD (500ML)', '2019-04-15 09:33:15', '2019-04-15 09:33:15'),
(5, 'AIRSURE ROOM AIR FRESHNER LEMON', '2019-04-18 05:49:18', '2019-04-18 05:49:18'),
(6, 'AIRSURE ROOM AIR FRESHNER LAVENDER', '2019-04-18 05:52:12', '2019-04-18 05:52:12'),
(7, 'WHITE SPONGE', '2019-04-18 06:14:08', '2019-04-18 06:14:08'),
(8, 'STC BIG GLASS DUSTER (RED)', '2019-04-22 08:14:45', '2019-04-22 08:14:45');

-- --------------------------------------------------------

--
-- Table structure for table `item_type`
--

CREATE TABLE `item_type` (
  `id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `code` varchar(10) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `item_type`
--

INSERT INTO `item_type` (`id`, `name`, `code`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Housekeeping', 'HK', 1, '2019-04-08 14:34:34', '2019-04-08 09:04:34'),
(2, 'Stationery', 'ST', 1, '2019-04-08 14:34:42', '2019-04-08 09:04:42'),
(3, 'Food & Beverage', 'F&B', 1, '2019-04-08 14:34:50', '2019-04-08 09:04:50'),
(4, 'Electric', 'ET', 1, '2019-04-08 14:34:58', '2019-04-08 09:04:58');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2014_10_12_000000_create_users_table', 1),
(2, '2014_10_12_100000_create_password_resets_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `model_nos`
--

CREATE TABLE `model_nos` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `brand_id` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT;

--
-- Dumping data for table `model_nos`
--

INSERT INTO `model_nos` (`id`, `name`, `brand_id`, `status`, `created_at`, `updated_at`) VALUES
(1, 'HP Test Model No. 1', 1, 1, '2019-02-25 12:00:10', '2019-02-25 06:30:10'),
(2, 'Lenovo Model Test 1', 2, 1, '2019-02-25 06:30:33', '2019-02-25 06:30:33');

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `proc_calc`
--

CREATE TABLE `proc_calc` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `company_id` int(11) NOT NULL,
  `site_id` int(11) NOT NULL,
  `type` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT;

--
-- Dumping data for table `proc_calc`
--

INSERT INTO `proc_calc` (`id`, `user_id`, `company_id`, `site_id`, `type`, `created_at`, `updated_at`) VALUES
(4, 8, 2, 2, 'Housekeeping', '2019-04-22 13:44:45', '2019-04-22 08:14:45'),
(5, 6, 3, 1, 'Stationery,Electric', '2019-04-15 09:33:15', '2019-04-15 09:33:15'),
(6, 6, 2, 2, 'Housekeeping', '2019-04-18 05:27:25', '2019-04-18 05:27:25'),
(7, 6, 1, 1, 'Food & Beverage', '2019-04-18 06:14:08', '2019-04-18 06:14:08');

-- --------------------------------------------------------

--
-- Table structure for table `sites`
--

CREATE TABLE `sites` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `status` tinyint(4) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `sites`
--

INSERT INTO `sites` (`id`, `name`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Site1', 1, '2019-02-25 08:20:05', '2019-02-25 08:20:05'),
(2, 'Test Site2', 1, '2019-02-25 13:50:25', '2019-02-25 08:20:25');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` tinyint(4) DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Ryan Chenkie', 'ryanchenkie@gmail.com', '$2y$10$sWj1/6dr6MeF7nmBqQR43OwViwE5KucrcRkiuf8saZW7PlTQS0F2G', 0, NULL, '2018-02-26 04:43:12', '2018-02-26 04:43:12'),
(2, 'Chris Sevilleja', 'chris@scotch.io', '$2y$10$sPyb1pGV7kt5ebrA1LWen.ulBaH52F5Go6GkbhsgzKyIHGIVk9bhe', 0, NULL, '2018-02-26 04:43:12', '2018-02-26 04:43:12'),
(3, 'Holly Lloyd', 'holly@scotch.io', '$2y$10$bMPSUQkHlFXMiMCwaW461e2mq9dP.vxOcAbK7OIQhMFawe.IOBESK', 0, NULL, '2018-02-26 04:43:12', '2018-02-26 04:43:12'),
(4, 'Adnan Kukic', 'adnan@scotch.io', '$2y$10$Nmg.8AUAKdzan4jpswZzRecCQOmM4o3lS4CEcNJmSuDcjbiKokrAy', 0, NULL, '2018-02-26 04:43:12', '2018-02-26 04:43:12'),
(5, 'Tanveer Khan', 'tanveer.khan@mrhomecare.in', '$2y$10$U9WhwRc7WijeZeeftUTFROVkwpsl13tf6ME8xJBlvvs8yPOAn2R3a', NULL, 'ukS99dq9BmzK0ukdZrSPDknzS5fwisEioSeleiotqp8lEoZz0miRBDXOnXdb', '2019-02-07 01:28:13', '2019-02-07 01:28:13'),
(6, 'Tanveer Khan', 'khanveerr@gmail.com', '$2y$10$/mgX0gGSZSVp9QDpDxvAQelOlgFB.hopPWXE9wJXiIGR3TXxottKa', NULL, NULL, '2019-02-22 04:43:03', '2019-02-22 04:43:03'),
(7, 'Admin', 'admin@gmail.com', '$2y$10$GD7jg8ZPimoQcAngro2qtOqN7y2Q9UxQoeOFMaR.jdV6gzEAWCBuW', NULL, NULL, '2019-02-22 04:47:25', '2019-02-22 04:47:25'),
(8, 'Vinay Gangan', 'vinaygangan@silagroup.co.in', '$2y$10$xpMxtYwWR22DOEfIA10UGuwapwDtiuJpHvL/5vfMcaCWfG33sE.Ja', NULL, NULL, '2019-04-22 07:34:56', '2019-04-22 07:34:56');

-- --------------------------------------------------------

--
-- Table structure for table `user_assign`
--

CREATE TABLE `user_assign` (
  `id` int(11) NOT NULL,
  `inventory_id` int(11) NOT NULL,
  `site_id` int(11) NOT NULL,
  `department_id` int(11) NOT NULL,
  `repair_cost` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `assigned_date` date NOT NULL,
  `status` tinyint(4) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user_assign`
--

INSERT INTO `user_assign` (`id`, `inventory_id`, `site_id`, `department_id`, `repair_cost`, `employee_id`, `assigned_date`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 2, 2, 12500, 1, '2019-03-20', 1, '2019-03-29 12:34:10', '2019-03-29 07:04:10'),
(2, 1, 1, 1, 23600, 2, '2019-03-21', 1, '2019-03-29 12:49:42', '2019-03-29 07:19:42');

-- --------------------------------------------------------

--
-- Table structure for table `vendors`
--

CREATE TABLE `vendors` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `company_id` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT;

--
-- Dumping data for table `vendors`
--

INSERT INTO `vendors` (`id`, `name`, `company_id`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Vendor1', 1, 1, '2019-02-25 01:55:53', '2019-02-25 01:55:53'),
(2, 'Vendor1', 2, 1, '2019-02-25 01:56:33', '2019-02-25 01:56:33'),
(3, 'Vendor1', 3, 1, '2019-02-25 03:20:21', '2019-02-25 03:20:21'),
(4, 'Vendor2', 2, 1, '2019-02-25 04:09:53', '2019-02-25 04:09:53');

-- --------------------------------------------------------

--
-- Table structure for table `zones`
--

CREATE TABLE `zones` (
  `id` int(11) NOT NULL,
  `zone_name` varchar(255) NOT NULL,
  `status` tinyint(4) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `zones`
--

INSERT INTO `zones` (`id`, `zone_name`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Maharashtra', 1, '2018-03-05 14:18:42', '0000-00-00 00:00:00'),
(2, 'Delhi', 1, '2018-03-06 06:20:23', '2018-03-06 00:50:23'),
(4, 'Haryana', 1, '2018-03-06 00:59:13', '2018-03-06 00:59:13'),
(6, 'Karnataka', 1, '2019-02-14 02:17:27', '2019-02-14 02:17:27');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `company`
--
ALTER TABLE `company`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cost_centres`
--
ALTER TABLE `cost_centres`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `inventory`
--
ALTER TABLE `inventory`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `inventory_transfer`
--
ALTER TABLE `inventory_transfer`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `items_1`
--
ALTER TABLE `items_1`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `item_calc`
--
ALTER TABLE `item_calc`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `item_master`
--
ALTER TABLE `item_master`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `item_type`
--
ALTER TABLE `item_type`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `model_nos`
--
ALTER TABLE `model_nos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD KEY `password_resets_email_index` (`email`);

--
-- Indexes for table `proc_calc`
--
ALTER TABLE `proc_calc`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sites`
--
ALTER TABLE `sites`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- Indexes for table `user_assign`
--
ALTER TABLE `user_assign`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `vendors`
--
ALTER TABLE `vendors`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `zones`
--
ALTER TABLE `zones`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `brands`
--
ALTER TABLE `brands`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `company`
--
ALTER TABLE `company`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `cost_centres`
--
ALTER TABLE `cost_centres`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `inventory`
--
ALTER TABLE `inventory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `inventory_transfer`
--
ALTER TABLE `inventory_transfer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `items`
--
ALTER TABLE `items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `items_1`
--
ALTER TABLE `items_1`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `item_calc`
--
ALTER TABLE `item_calc`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT for table `item_master`
--
ALTER TABLE `item_master`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT for table `item_type`
--
ALTER TABLE `item_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `model_nos`
--
ALTER TABLE `model_nos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `proc_calc`
--
ALTER TABLE `proc_calc`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `sites`
--
ALTER TABLE `sites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT for table `user_assign`
--
ALTER TABLE `user_assign`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `vendors`
--
ALTER TABLE `vendors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `zones`
--
ALTER TABLE `zones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

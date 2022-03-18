-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 25, 2019 at 03:40 PM
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

--
-- Dumping data for table `req_vendors`
--

INSERT INTO `req_vendors` (`id`, `zone_id`, `state_id`, `item_type_id`, `name`, `address`, `gst_no`, `code`, `contact_person`, `contact_no`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 1, 'Wrapper India', '30-31, Bhiwandiwala Terrace,618, J.S.S.Road, Dhobi Talao,Mumbai-400002', '27ADVPB5906A1ZQ', 'WI', 'Chandra Prakash Baid', '022-22074782 / 83', 1, '2019-06-25 09:43:32', '2019-06-25 09:43:32'),
(2, 1, 1, 1, 'The Lara Enterprises', 'Shop No. 2 Rehab Bldg, Akruti No. 1, Shatri Nagar, BKC, Bandra (E) , Mumbai  - 400 051', '27AODPV5454L1ZB', 'Lara', 'Ramesh', '022-26421600/7506662157/7506662159', 1, '2019-06-25 09:45:01', '2019-06-25 09:45:01'),
(3, 1, 1, 1, 'Varni Analytical Laboratory', '222, Shyam Industrial, Near Prasad Hotel, Mahajanwadi, Mira Road (E), Thane-401107.', '27AGXPV8754D1ZG', 'VAL', 'Akshada', '7208888309 / 9987095006', 1, '2019-06-25 09:47:46', '2019-06-25 09:47:46'),
(4, 1, 1, 1, 'Avnt Sense', 'Unit No. 2 Raghunath Villa, Plot No. 80-81, Sector - 34, Kamothe, Navi Mumbai 410209', '123', 'Avnt', 'Satya Puhan', '9768328844', 1, '2019-06-25 09:49:26', '2019-06-25 09:49:26'),
(5, 1, 1, 1, 'Geeta Enterprises', 'Unit.7B, Nand Ghanshyam Industrial Estate, Off. Mahakali Road, Andheri (East) Mumbai.- 93.', '27BXVPM9237J1Z1', 'GE', 'Dinesh Ahir', '9768456656 | 9820474823', 1, '2019-06-25 09:50:25', '2019-06-25 09:50:25'),
(6, 1, 1, 1, 'Grenove', 'Shivprasad, Plot No.18, Shivaji Housing Society, Senapati Bapat Road, Pune-411038, Maharashtra', '27AAGCG3157R1ZZ', 'GS', 'Mr Martin', '7888001469', 1, '2019-06-25 09:52:14', '2019-06-25 09:52:14'),
(7, 1, 1, 1, 'Handloom', '6/25, Jogani Industrial Complex, Near ati, V.N.Purav Sion -chunabhatti, Mumbai - 400022', '27AAEFH5745H1Z9', 'HL', 'Hardik', '9769099905', 1, '2019-06-25 09:53:18', '2019-06-25 09:53:18'),
(8, 1, 1, 1, 'Office Express', 'Office No.3-A, Ramprasad Soc, Koldongri, Galli No.1, Sahar Road, Andheri(E), Mumbai-400069.', '27BIIPD0274Q1ZX', 'OEF', 'Mr Devji', '9867620352', 1, '2019-06-25 09:54:34', '2019-06-25 09:54:34'),
(9, 1, 1, 1, 'Sai Enterprises', 'Vakola Pipeline, Near Gaodevi Police Station, Santacruz East Mumbai - 400055', '27AJMPG0803G1ZJ', 'SS', 'Bunty / Rahat', '9819181694 / 9930629360', 1, '2019-06-25 09:55:45', '2019-06-25 09:55:45'),
(10, 1, 1, 1, 'Ivaana Ventures Pvt Ltd', 'B-42, Idea Square, 2nd Floor, Opp. City Mall, New Link Road, Andheri (W), Mumbai - 400053', '27AAECD9778R1ZH', 'IVP', 'Varun Patel', '9821021425', 1, '2019-06-25 10:00:48', '2019-06-25 10:00:48'),
(11, 1, 1, 3, 'Fresh & Honest Cafe Limited', 'Address', '123', 'Fresh', 'Tanveer Khan', '9768328844', 1, '2019-06-25 11:39:53', '2019-06-25 11:39:53'),
(12, 2, 2, 1, 'Access Office Solution', 'Test Address', '123', 'AOS', 'Tanveer Khan', '9768328844', 1, '2019-06-25 12:21:06', '2019-06-25 12:21:06'),
(13, 3, 6, 1, 'Geeta Enterprises', 'Unit.7B, Nand Ghanshyam Industrial Estate, Off. Mahakali Road, Andheri (East) Mumbai.- 93', '27BXVPM9237J1Z1', 'GE', 'Dinesh Ahir', '9768456656 | 9820474823', 1, '2019-06-25 13:13:04', '2019-06-25 13:13:04'),
(14, 3, 6, 1, 'Baba Multi Trading', 'Test Address', '123', 'Baba', 'Tanveer Khan', '9768328844', 1, '2019-06-25 13:14:10', '2019-06-25 13:14:10');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

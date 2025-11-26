-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 19, 2025 at 02:27 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `imc_calculator`
--

-- --------------------------------------------------------

--
-- Table structure for table `resultados_imc`
--

CREATE TABLE `resultados_imc` (
  `id` int(11) NOT NULL,
  `peso` decimal(5,2) DEFAULT NULL,
  `altura` decimal(5,2) DEFAULT NULL,
  `edad` int(11) DEFAULT NULL,
  `imc` decimal(5,2) DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `resultados_imc`
--

INSERT INTO `resultados_imc` (`id`, `peso`, `altura`, `edad`, `imc`, `estado`, `fecha`) VALUES
(46, 90.00, 1.80, 16, 27.78, 'Sobrepeso', '2025-11-12 03:57:31'),
(47, 90.00, 1.80, 16, 27.78, 'Sobrepeso', '2025-11-12 05:01:23'),
(48, 70.00, 1.70, 17, 24.22, 'Peso normal', '2025-11-12 12:12:10'),
(49, 90.00, 1.80, 16, 27.78, 'Sobrepeso', '2025-11-12 13:17:54'),
(50, 56.00, 1.71, 17, 19.15, 'Peso normal', '2025-11-12 13:20:29'),
(51, 85.00, 1.70, 17, 29.41, 'Sobrepeso', '2025-11-19 13:20:53'),
(52, 54.00, 160.00, 17, 0.00, 'Bajo peso', '2025-11-19 13:21:33');

-- --------------------------------------------------------

--
-- Table structure for table `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre_usuario` varchar(50) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre_usuario`, `correo`, `contrasena`, `fecha_registro`) VALUES
(1, 'emir', 'aoal@gmail.com', '$2y$10$HoQwoQWpaCQp4lVNE0bxm.hafr4AC.go0mVTFlAvisbxZtI1hdvo2', '2024-11-06 20:24:31'),
(2, 'josh', 'joshsalben@gmail.com', '$2y$10$WFaIXmh/dk/sVqP4nnkpdeuOnA3NQBe6pcxtcvYUesX8uVWMs0Iv2', '2025-11-12 01:40:04'),
(3, 'joshua', 'joshsb@gmail.com', '$2y$10$zdhV6vnKIVixuI/K6GP/.eSIrqlJdxwoNflkUr7Bn5mIM82PEiOhK', '2025-11-12 03:55:52'),
(4, 'yohaan', 'yohaansosa1@gmai.com', '$2y$10$aR8w26L21RMWjDfLfaWJ.uaih/OB2nOxUaU9ayM84nqz0nyJfMvPy', '2025-11-12 12:11:29');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `resultados_imc`
--
ALTER TABLE `resultados_imc`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre_usuario` (`nombre_usuario`),
  ADD UNIQUE KEY `correo` (`correo`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `resultados_imc`
--
ALTER TABLE `resultados_imc`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

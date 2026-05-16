-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Waktu pembuatan: 16 Bulan Mei 2026 pada 06.33
-- Versi server: 10.4.28-MariaDB
-- Versi PHP: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `waste`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_04_27_143736_create_personal_access_tokens_table', 1),
(5, '2026_05_13_153548_add_phone_and_role_to_users_table', 1),
(6, '2026_05_14_042533_add_new_fields_to_users_table', 1),
(7, '2026_05_14_042838_add_address_and_photo_to_users_table', 1),
(8, '2026_05_14_062329_create_mresto_table', 2),
(9, '2026_05_14_062333_create_mmenu_table', 2),
(10, '2026_05_14_062338_create_pesanan_table', 2),
(11, '2026_05_14_062343_create_pesanandet_table', 2),
(12, '2026_05_15_092101_add_ui_columns_to_mresto_table', 3),
(16, '2026_05_15_105058_add_foto_url_to_mmenu_table', 4);

-- --------------------------------------------------------

--
-- Struktur dari tabel `mmenu`
--

CREATE TABLE `mmenu` (
  `KodeMenu` varchar(5) NOT NULL,
  `KodeResto` varchar(5) NOT NULL,
  `NamaMenu` varchar(255) NOT NULL,
  `HargaMenu` int(11) NOT NULL,
  `Stok` int(11) NOT NULL DEFAULT 99,
  `foto_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `mmenu`
--

INSERT INTO `mmenu` (`KodeMenu`, `KodeResto`, `NamaMenu`, `HargaMenu`, `Stok`, `foto_url`, `created_at`, `updated_at`) VALUES
('M001', 'R001', 'Nasi Goreng', 15000, 10, 'https://takestwoeggs.com/wp-content/uploads/2025/03/Overhead-plate-Nasi-Goreng-Indonesian-Fried-Rice-500x500.jpg', NULL, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `mresto`
--

CREATE TABLE `mresto` (
  `KodeResto` varchar(5) NOT NULL,
  `Nama` varchar(255) NOT NULL,
  `Alamat` varchar(255) DEFAULT NULL,
  `JamTutup` varchar(255) DEFAULT NULL,
  `foto_url` varchar(255) DEFAULT NULL,
  `rating` decimal(2,1) DEFAULT 0.0,
  `waktu_tunggu` int(11) DEFAULT NULL,
  `diskon` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `mresto`
--

INSERT INTO `mresto` (`KodeResto`, `Nama`, `Alamat`, `JamTutup`, `foto_url`, `rating`, `waktu_tunggu`, `diskon`, `created_at`, `updated_at`) VALUES
('R001', 'Warung AW', 'Kantin UC Makassar', '18:00', 'https://img.freepik.com/vektor-premium/desain-logo-huruf-aw-dengan-latar-belakang-hitam-konsep-logo-inisial-kreatif-aw-desain-huruf-aw-desain-huruf-putih-aw-dengan-latar-belakang-hitam-logo-a-w-a-w_229120-136093.jpg?semt=ais_hybrid&w=740&q=80', 4.3, 10, 10, NULL, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(13, 'App\\Models\\User', 1, 'auth_token', '9da8ae1ee9fb59cb2499ad3ece3a929d4e94b38a322fa29ce6afd719aceaef90', '[\"*\"]', '2026-05-15 10:08:26', NULL, '2026-05-15 09:44:17', '2026-05-15 10:08:26');

-- --------------------------------------------------------

--
-- Struktur dari tabel `pesanan`
--

CREATE TABLE `pesanan` (
  `NoPesanan` varchar(13) NOT NULL,
  `Tgl` date NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `KodeResto` varchar(5) NOT NULL,
  `Status` int(11) NOT NULL DEFAULT 0,
  `NoUrutPesan` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `pesanan`
--

INSERT INTO `pesanan` (`NoPesanan`, `Tgl`, `user_id`, `KodeResto`, `Status`, `NoUrutPesan`, `created_at`, `updated_at`) VALUES
('PES866526633', '2026-05-15', 1, 'R001', 0, 1, NULL, NULL),
('PES866711347', '2026-05-15', 1, 'R001', 0, 2, NULL, NULL),
('PES867593909', '2026-05-15', 1, 'R001', 0, 3, NULL, NULL),
('PES867769758', '2026-05-15', 1, 'R001', 0, 4, NULL, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `pesanandet`
--

CREATE TABLE `pesanandet` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `NoPesanan` varchar(13) NOT NULL,
  `Kode` varchar(5) NOT NULL,
  `Jumlah` int(11) NOT NULL,
  `Harga` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `pesanandet`
--

INSERT INTO `pesanandet` (`id`, `NoPesanan`, `Kode`, `Jumlah`, `Harga`, `created_at`, `updated_at`) VALUES
(5, 'PES866526633', 'M001', 3, 15000, NULL, NULL),
(6, 'PES866711347', 'M001', 3, 15000, NULL, NULL),
(7, 'PES867593909', 'M001', 1, 15000, NULL, NULL),
(8, 'PES867769758', 'M001', 1, 15000, NULL, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'pelanggan',
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `phone`, `role`, `email_verified_at`, `password`, `address`, `photo_url`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Felicia', 'felicia@gmail.com', '01234567890', 'pelanggan', NULL, '$2y$12$Q.dAFHavGoFOZDKy5PhSi.qlL1Xjzk5dqHUYMKiYEV086z66hX.xK', 'Jalan Rappocini', 'avatars/a8bfc121-3bc9-44cb-9f99-fe1eb910a071.jpg', NULL, '2026-05-13 22:06:39', '2026-05-14 07:59:59');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indeks untuk tabel `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indeks untuk tabel `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indeks untuk tabel `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indeks untuk tabel `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `mmenu`
--
ALTER TABLE `mmenu`
  ADD PRIMARY KEY (`KodeMenu`),
  ADD KEY `mmenu_koderesto_foreign` (`KodeResto`);

--
-- Indeks untuk tabel `mresto`
--
ALTER TABLE `mresto`
  ADD PRIMARY KEY (`KodeResto`);

--
-- Indeks untuk tabel `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indeks untuk tabel `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indeks untuk tabel `pesanan`
--
ALTER TABLE `pesanan`
  ADD PRIMARY KEY (`NoPesanan`),
  ADD KEY `pesanan_user_id_foreign` (`user_id`),
  ADD KEY `pesanan_koderesto_foreign` (`KodeResto`);

--
-- Indeks untuk tabel `pesanandet`
--
ALTER TABLE `pesanandet`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pesanandet_nopesanan_foreign` (`NoPesanan`),
  ADD KEY `pesanandet_kode_foreign` (`Kode`);

--
-- Indeks untuk tabel `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT untuk tabel `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT untuk tabel `pesanandet`
--
ALTER TABLE `pesanandet`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `mmenu`
--
ALTER TABLE `mmenu`
  ADD CONSTRAINT `mmenu_koderesto_foreign` FOREIGN KEY (`KodeResto`) REFERENCES `mresto` (`KodeResto`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `pesanan`
--
ALTER TABLE `pesanan`
  ADD CONSTRAINT `pesanan_koderesto_foreign` FOREIGN KEY (`KodeResto`) REFERENCES `mresto` (`KodeResto`) ON DELETE CASCADE,
  ADD CONSTRAINT `pesanan_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `pesanandet`
--
ALTER TABLE `pesanandet`
  ADD CONSTRAINT `pesanandet_kode_foreign` FOREIGN KEY (`Kode`) REFERENCES `mmenu` (`KodeMenu`) ON DELETE CASCADE,
  ADD CONSTRAINT `pesanandet_nopesanan_foreign` FOREIGN KEY (`NoPesanan`) REFERENCES `pesanan` (`NoPesanan`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

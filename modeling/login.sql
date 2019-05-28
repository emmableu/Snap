CREATE TABLE IF NOT EXISTS `users` (

  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,

  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,

  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,

  `password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
s
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,

  `created_at` timestamp NULL DEFAULT NULL,

  `updated_at` timestamp NULL DEFAULT NULL,

  `google_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,

  PRIMARY KEY (`id`)

) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=24 ;